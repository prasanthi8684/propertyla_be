import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const { Client } = pkg;

dotenv.config();

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
  try {
    console.log('Connecting to PostgreSQL database...');
    await client.connect();
    console.log('Connected successfully!');

    console.log('Reading initialization SQL...');
    const sqlPath = path.join(process.cwd(), 'sql', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing SQL initialization script...');
    await client.query(sql);

    console.log('Database initialized successfully!');
    console.log('Tables created:');
    console.log('  - users');
    console.log('\nYour PostgreSQL database is ready for use.');

  } catch (error) {
    console.error('Error setting up database:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
