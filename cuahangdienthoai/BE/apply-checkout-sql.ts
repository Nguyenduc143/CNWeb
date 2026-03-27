import { getConnection } from './src/config/db';
import fs from 'fs';
import path from 'path';

async function run() {
  try {
    const pool = await getConnection();
    const sqlFile = fs.readFileSync(path.join(__dirname, 'migrations', 'm4_checkout.sql'), 'utf8');
    const batches = sqlFile.split(/^GO/img);
    
    for (const batch of batches) {
      if (batch.trim()) {
         await pool.request().query(batch);
      }
    }
    console.log('--- Checkout SQL Migration Applied Successfully ---');
    process.exit(0);
  } catch (err) {
    console.error('Migration Error:', err);
    process.exit(1);
  }
}

run();
