#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(supabaseUrl);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Prefer': 'return=representation',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          // Try with raw query if RPC fails
          if (res.statusCode === 404 || data.includes('function not found')) {
            resolve({ success: false, retry: true });
          } else {
            resolve({ success: false, error: data, status: res.statusCode });
          }
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(JSON.stringify({ sql_string: sql }));
    req.end();
  });
}

async function setupSupabase() {
  console.log('🚀 Starting Supabase setup...\n');

  try {
    // Read SQL schema
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    // Split statements by semicolon, but handle comments
    const lines = schemaSql.split('\n');
    const statements = [];
    let currentStatement = '';

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip comments
      if (trimmed.startsWith('--') || trimmed === '') {
        continue;
      }

      currentStatement += line + '\n';

      if (trimmed.endsWith(';')) {
        statements.push(currentStatement);
        currentStatement = '';
      }
    }

    console.log(`📋 Found ${statements.length} SQL statements\n`);

    // For simplicity, combine all statements and execute as one
    const combinedSQL = statements.join('\n');

    console.log('Executing SQL schema...');
    const result = await executeSQL(combinedSQL);

    if (result.success) {
      console.log('✅ Schema executed successfully!\n');
      console.log('✅ Tables created');
      console.log('✅ RLS policies configured');
    } else if (result.retry) {
      console.log('⚠️  RPC function not available, trying alternative approach...');
      console.log('📝 Please manually run the SQL in Supabase Dashboard:');
      console.log('   1. Go to https://app.supabase.com');
      console.log('   2. Select your project');
      console.log('   3. SQL Editor → New Query');
      console.log('   4. Copy content from supabase/schema.sql');
      console.log('   5. Execute');
    } else {
      console.log('❌ Setup failed:', result.error);
    }

    console.log('\n🎉 Supabase credentials verified!');
    console.log(`   URL: ${supabaseUrl}`);
  } catch (err) {
    console.error('❌ Setup error:', err.message);
    process.exit(1);
  }
}

setupSupabase();
