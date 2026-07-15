const fs = require('fs');
const path = require('path');
const { parse } = require('fast-csv');

const REAL_DATA_DIR = path.join(__dirname, '..', 'real_data');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'real_data_json');

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

function readCSVFastCsv(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath, { encoding: 'utf-8' })
      .pipe(parse({ headers: true }))
      .on('error', (error) => {
        console.error(`Error parsing ${filePath}:`, error.message);
        resolve([]);
      })
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', () => {
        resolve(results);
      });
  });
}

async function convertData() {
  console.log('🔄 Starting real data conversion (v2 - fast-csv)...\n');

  try {
    console.log('📖 Reading CSV files...');

    // 병렬 로드
    const [jobs, jobDetails, companies, categories, attractions] = await Promise.all([
      readCSVFastCsv(path.join(REAL_DATA_DIR, 'jobs_1000.csv')),
      readCSVFastCsv(path.join(REAL_DATA_DIR, 'job_details_1000.csv')),
      readCSVFastCsv(path.join(REAL_DATA_DIR, 'companies_449.csv')),
      readCSVFastCsv(path.join(REAL_DATA_DIR, 'categories.csv')),
      readCSVFastCsv(path.join(REAL_DATA_DIR, 'attractions.csv'))
    ]);

    console.log(`  ✓ Jobs: ${jobs.length}`);
    console.log(`  ✓ Job Details: ${jobDetails.length}`);
    console.log(`  ✓ Companies: ${companies.length}`);
    console.log(`  ✓ Categories: ${categories.length}`);
    console.log(`  ✓ Attractions: ${attractions.length}\n`);

    // Categories 처리
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

    // Attractions 처리
    console.log('✨ Processing attractions...');
    const attractionTags = attractions.map(attr => ({
      id: parseInt(attr.id),
      type: 'attraction',
      title: attr.title
    }));
    console.log(`  ✓ Attraction tags: ${attractionTags.length}\n`);

    // Companies 처리
    console.log('🏢 Processing companies...');
    const companiesMap = new Map();
    const processedCompanies = companies.map(comp => {
      const logoUrl = comp['company.logo_url.origin'] || '';
      const color = getColorFromUrl(logoUrl);

      const processed = {
        id: comp['company.id'],
        name: comp['company.name'],
        color: color,
        description: comp['company.description'] || '',
        benefits: '',
        cultureTagIds: [],
        logoUrl: logoUrl
      };

      companiesMap.set(comp['company.id'], processed);
      return processed;
    });
    console.log(`  ✓ Processed ${processedCompanies.length} companies\n`);

    // Job Details 맵 생성
    console.log('📋 Processing jobs with details...');
    const jobDetailsMap = new Map();
    jobDetails.forEach(jd => {
      if (jd.id) {
        jobDetailsMap.set(jd.id.trim(), jd);
      }
    });

    console.log(`  ℹ️  Job Details mapping: ${jobDetailsMap.size} entries\n`);

    // Jobs 처리 (Job Details와 조인)
    const processedJobs = jobs.map(job => {
      const jobId = job.id ? job.id.trim() : '';
      const jd = jobDetailsMap.get(jobId);
      const companyId = job['company.id'];

      let skillTagIds = [];
      let intro = '';
      let mainTasks = '';
      let requirements = '';
      let preferredPoints = '';
      let hireRounds = '';
      let benefits = '';
      let annualFrom = 0;
      let annualTo = 0;

      if (jd) {
        // skill_tags 파싱
        if (jd.skill_tags) {
          const skillTags = parseJSON(jd.skill_tags);
          if (Array.isArray(skillTags)) {
            skillTagIds = skillTags.map(s => {
              if (typeof s === 'object' && s.id) return s.id;
              return null;
            }).filter(id => id !== null);
          }
        }

        // 상세 정보
        intro = jd['detail.intro'] || '';
        mainTasks = jd['detail.main_tasks'] || '';
        requirements = jd['detail.requirements'] || '';
        preferredPoints = jd['detail.preferred_points'] || '';
        hireRounds = jd['detail.hire_rounds'] || '';
        benefits = jd['detail.benefits'] || '';

        // 경력 요구사항
        annualFrom = jd.annual_from ? parseInt(jd.annual_from) : 0;
        annualTo = jd.annual_to ? parseInt(jd.annual_to) : 0;
      }

      return {
        id: jobId,
        companyId: companyId,
        companyName: job['company.name'],
        companyColor: companiesMap.get(companyId)?.color || '#2563eb',
        category: job['category_tags.parent_tag.title'] || 'Other',
        position: job.name,
        location: job['address.full_location'] || 'Unknown',
        dueTime: job.due_time || null,
        applyUrl: job.url,
        skillTagIds: skillTagIds,
        salary: null,
        // JobDetail fields
        intro: intro,
        mainTasks: mainTasks,
        requirements: requirements,
        preferredPoints: preferredPoints,
        hireRounds: hireRounds,
        benefits: benefits,
        promoImages: [],
        annualFrom: annualFrom,
        annualTo: annualTo
      };
    }).filter(job => job !== null);

    const jobsWithDetails = processedJobs.filter(j => j.intro || j.mainTasks).length;
    console.log(`  ✓ Processed ${processedJobs.length} jobs`);
    console.log(`  ✓ Jobs with details: ${jobsWithDetails}\n`);

    // 출력 디렉토리 생성
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // JSON 저장
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
    console.log('═'.repeat(50));
    console.log(`Total Jobs converted:           ${processedJobs.length}`);
    console.log(`Jobs with detail info:          ${jobsWithDetails}`);
    console.log(`Companies converted:            ${processedCompanies.length}`);
    console.log(`Category tags:                  ${parentTags.length + childTags.length}`);
    console.log(`Attraction tags:                ${attractionTags.length}`);
    console.log(`Output directory:               ${OUTPUT_DIR}`);
    console.log('═'.repeat(50));

    if (jobsWithDetails === processedJobs.length) {
      console.log('\n✅ SUCCESS: All jobs have complete detail information!\n');
    } else if (jobsWithDetails > 0) {
      console.log(`\n⚠️  PARTIAL: ${jobsWithDetails}/${processedJobs.length} jobs have details (${Math.round(jobsWithDetails/processedJobs.length*100)}%)\n`);
    } else {
      console.log('\n❌ FAILED: No job details were loaded. Falling back to Plan B.\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

convertData();
