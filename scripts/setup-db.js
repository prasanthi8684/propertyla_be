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

    console.log('\n1. Creating users table...');
    const initSqlPath = path.join(process.cwd(), 'sql', 'init.sql');
    const initSql = fs.readFileSync(initSqlPath, 'utf8');
    await client.query(initSql);
    console.log('✓ Users table created successfully');

    console.log('\n2. Creating properties table...');
    const propertiesSqlPath = path.join(process.cwd(), 'sql', 'properties.sql');
    const propertiesSql = fs.readFileSync(propertiesSqlPath, 'utf8');
    await client.query(propertiesSql);
    console.log('✓ Properties table created successfully');

    console.log('\n✓ Database initialized successfully!');
    console.log('\nTables created:');
    console.log('  ✓ users (with UUID primary key)');
    console.log('  ✓ properties (with foreign key to users)');
    console.log('\nIndexes created:');
    console.log('  ✓ User indexes: email, username, phone_number, verification_token');
    console.log('  ✓ Property indexes: user_id, listing_type, city_name, price, status, composite');
    console.log('\nTriggers created:');
    console.log('  ✓ Auto-update updated_at for users');
    console.log('  ✓ Auto-update updated_at for properties');
    console.log('\nYour PostgreSQL database is ready for use!');

  } catch (error) {
    console.error('\n✗ Error setting up database:', error.message);
    console.error('\nPlease check:');
    console.error('  1. Database connection credentials in .env file');
    console.error('  2. PostgreSQL server is running');
    console.error('  3. Database exists and is accessible');
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase();
