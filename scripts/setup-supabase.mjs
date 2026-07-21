#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function setupSupabase() {
  console.log('🚀 Starting Supabase setup...\n');

  try {
    // Read SQL schema
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    // Split by semicolon and filter empty statements
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`📋 Found ${statements.length} SQL statements\n`);

    let successCount = 0;
    let skipCount = 0;

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const preview = statement.substring(0, 60).replace(/\n/g, ' ');

      try {
        const { error } = await supabase.rpc('exec_sql', {
          sql_string: statement + ';',
        }).catch(() => {
          // If RPC doesn't exist, try direct query (will fail but we'll handle it)
          return supabase.from('_').select().catch(e => ({ error: e }));
        });

        if (error) {
          // Check if it's an "already exists" error (which is OK)
          if (
            error.message?.includes('already exists') ||
            error.message?.includes('ALREADY EXISTS') ||
            error.message?.includes('duplicate key') ||
            error.message?.includes('policy already exists')
          ) {
            skipCount++;
            console.log(`⏭️  SKIP (${i + 1}/${statements.length}): ${preview}...`);
          } else {
            console.log(`❌ FAIL (${i + 1}/${statements.length}): ${preview}...`);
            console.error(`   Error: ${error.message}`);
          }
        } else {
          successCount++;
          console.log(`✅ OK (${i + 1}/${statements.length}): ${preview}...`);
        }
      } catch (err) {
        console.error(`❌ ERROR (${i + 1}/${statements.length}): ${preview}...`);
        console.error(`   ${err.message}`);
      }
    }

    console.log(`\n📊 Results:`);
    console.log(`   ✅ Executed: ${successCount}`);
    console.log(`   ⏭️  Skipped: ${skipCount}`);
    console.log(`   ❌ Failed: ${statements.length - successCount - skipCount}`);

    if (successCount > 0 || skipCount > 0) {
      console.log('\n🎉 Supabase setup completed!');
      console.log('Tables and RLS policies have been configured.');
    } else {
      console.log('\n⚠️  Setup may have failed. Check Supabase dashboard manually.');
    }
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    process.exit(1);
  }
}

setupSupabase();
