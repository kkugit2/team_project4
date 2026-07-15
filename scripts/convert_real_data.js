const fs = require('fs');
const path = require('path');
const https = require('https');
const Papa = require('papaparse');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('⚠️  sharp not available, using fallback color method');
  sharp = null;
}

const REAL_DATA_DIR = path.join(__dirname, '..', 'real_data');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'real_data_json');

// 색상 팔레트 (로고 URL 해시로 선택)
const COLOR_PALETTE = [
  '#2563eb', '#0891b2', '#16a34a', '#f59e0b', '#9333ea',
  '#1d4ed8', '#0f766e', '#db2777', '#b45309', '#4f46e5',
  '#7c3aed', '#dc2626', '#ea580c', '#ea02c0', '#2dd4bf',
  '#0084ff', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'
];

function hashUrl(url) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getColorFromUrl(url) {
  if (!url) return COLOR_PALETTE[0];
  const hash = hashUrl(url);
  return COLOR_PALETTE[hash % COLOR_PALETTE.length];
}

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const csvData = fs.readFileSync(filePath, 'utf-8');
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    });
  });
}

function parseJSON(str) {
  if (!str || typeof str !== 'string') return [];
  try {
    const normalized = str
      .replace(/'/g, '"')
      .replace(/None/g, 'null')
      .replace(/True/g, 'true')
      .replace(/False/g, 'false');
    return JSON.parse(normalized);
  } catch (e) {
    return [];
  }
}

// 이미지에서 dominant 색상 추출
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout')), 5000);
    https.get(url, (res) => {
      clearTimeout(timeout);
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function extractImageColor(imageUrl) {
  if (!imageUrl || !sharp) {
    return getColorFromUrl(imageUrl);
  }

  try {
    const imageBuffer = await downloadImage(imageUrl);
    const stats = await sharp(imageBuffer).stats();
    const dominant = stats.dominant;
    const hex = rgbToHex(dominant.r, dominant.g, dominant.b);
    return hex;
  } catch (error) {
    // Fallback: 실패하면 URL 해시 기반 색상 사용
    return getColorFromUrl(imageUrl);
  }
}

async function convertData() {
  console.log('🔄 Starting real data conversion...\n');

  try {
    console.log('📖 Reading CSV files...');
    const jobs = await readCSV(path.join(REAL_DATA_DIR, 'jobs_1000.csv'));
    const jobDetails = await readCSV(path.join(REAL_DATA_DIR, 'job_details_1000.csv'));
    const companies = await readCSV(path.join(REAL_DATA_DIR, 'companies_449.csv'));
    const categories = await readCSV(path.join(REAL_DATA_DIR, 'categories.csv'));
    const attractions = await readCSV(path.join(REAL_DATA_DIR, 'attractions.csv'));

    console.log(`  ✓ Jobs: ${jobs.length}`);
    console.log(`  ✓ Companies: ${companies.length}`);
    console.log(`  ✓ Categories: ${categories.length}`);
    console.log(`  ✓ Attractions: ${attractions.length}`);
    console.log(`  ℹ️  Job details will be loaded at runtime\n`);

    console.log('🏷️  Processing categories...');
    const parentTags = [];
    const childTags = [];
    const seenParents = new Set();

    for (const cat of categories) {
      const parentId = parseInt(cat.parent_id);
      const parentTitle = cat.parent_title;
      const childId = parseInt(cat.child_id);
      const childTitle = cat.child_title;

      if (!seenParents.has(parentId)) {
        parentTags.push({ id: parentId, type: 'category', title: parentTitle });
        seenParents.add(parentId);
      }
      childTags.push({ id: childId, type: 'category', title: childTitle });
    }
    console.log(`  ✓ Parent tags: ${parentTags.length}, Child tags: ${childTags.length}\n`);

    console.log('✨ Processing attractions...');
    const attractionTags = attractions.map(attr => ({
      id: parseInt(attr.id),
      type: 'attraction',
      title: attr.title
    }));
    console.log(`  ✓ Attraction tags: ${attractionTags.length}\n`);

    console.log('🏢 Processing companies...');
    const companiesMap = new Map();

    // async 처리를 위해 순차 처리
    let successCount = 0;
    let fallbackCount = 0;
    const processedCompanies = [];

    for (let i = 0; i < companies.length; i++) {
      const comp = companies[i];
      const logoUrl = comp['company.logo_url.origin'] || '';

      let color;
      try {
        color = await extractImageColor(logoUrl);
        if (color === getColorFromUrl(logoUrl)) {
          fallbackCount++;
        } else {
          successCount++;
        }
      } catch (e) {
        color = getColorFromUrl(logoUrl);
        fallbackCount++;
      }

      // description에서 불필요한 데이터 제거 (CSV 파싱 오류로 인한 잔여 데이터)
      let description = comp['company.description'] || '';
      // 개행 이후의 데이터는 다음 행의 데이터가 섞인 것이므로 제거
      if (description.includes('\n')) {
        description = description.split('\n')[0];
      }

      const processed = {
        id: comp['company.id'],
        name: comp['company.name'],
        color: color,
        description: description.trim(),
        benefits: '',
        cultureTagIds: [],
        logoUrl: logoUrl
      };

      companiesMap.set(comp['company.id'], processed);
      processedCompanies.push(processed);

      // 진행률 표시 (50개 단위)
      if ((i + 1) % 50 === 0) {
        console.log(`  ⏳ Processed ${i + 1}/${companies.length}...`);
      }
    }

    console.log(`  ✓ Processed ${processedCompanies.length} companies`);
    console.log(`    └─ Actual colors: ${successCount}, Fallback: ${fallbackCount}\n`);

    // job_details를 ID로 매핑
    const jobDetailsMap = new Map();
    jobDetails.forEach(detail => {
      jobDetailsMap.set(detail.id, detail);
    });

    console.log('📋 Processing jobs...');
    const processedJobs = jobs.map(job => {
      const companyId = job['company.id'];

      // skill_tags 파싱 (job_details에서 가져오기)
      let skillTagIds = [];
      const jobDetail = jobDetailsMap.get(job.id);
      if (jobDetail && jobDetail['skill_tags'] && typeof jobDetail['skill_tags'] === 'string') {
        try {
          const normalized = jobDetail['skill_tags']
            .replace(/'/g, '"')
            .replace(/None/g, 'null')
            .replace(/True/g, 'true')
            .replace(/False/g, 'false');
          const parsed = JSON.parse(normalized);
          if (Array.isArray(parsed)) {
            skillTagIds = parsed
              .map((s) => {
                if (typeof s === 'object' && s?.id) return parseInt(s.id);
                if (typeof s === 'number') return s;
                return null;
              })
              .filter((id) => id !== null);
          }
        } catch (e) {
          // 파싱 실패시 빈 배열
        }
      }

      return {
        id: job.id,
        companyId: companyId,
        companyName: job['company.name'],
        companyColor: companiesMap.get(companyId)?.color || '#2563eb',
        category: job['category_tags.parent_tag.title'] || 'Other',
        position: job.name,
        location: job['address.full_location'] || 'Unknown',
        dueTime: job.due_time || null,
        applyUrl: job.url,
        skillTagIds: skillTagIds,
        salary: null
      };
    }).filter(job => job !== null);

    console.log(`  ✓ Processed ${processedJobs.length} jobs\n`);

    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    console.log('💾 Saving JSON files...');
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'jobs.json'),
      JSON.stringify(processedJobs, null, 2),
      'utf-8'
    );
    console.log('  ✓ jobs.json');

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'companies.json'),
      JSON.stringify(processedCompanies, null, 2),
      'utf-8'
    );
    console.log('  ✓ companies.json');

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'categories.json'),
      JSON.stringify([...parentTags, ...childTags], null, 2),
      'utf-8'
    );
    console.log('  ✓ categories.json');

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'attractions.json'),
      JSON.stringify(attractionTags, null, 2),
      'utf-8'
    );
    console.log('  ✓ attractions.json\n');

    console.log('📊 Conversion Summary');
    console.log('═'.repeat(40));
    console.log(`Jobs converted:       ${processedJobs.length}`);
    console.log(`Companies converted:  ${processedCompanies.length}`);
    console.log(`Category tags:        ${parentTags.length + childTags.length}`);
    console.log(`Attraction tags:      ${attractionTags.length}`);
    console.log(`Output directory:     ${OUTPUT_DIR}`);
    console.log('═'.repeat(40));
    console.log('\n✅ Real data conversion completed!\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

convertData();
