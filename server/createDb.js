const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'goldtech_db'}\`;`);
    console.log('Database berhasil dibuat!');
    await connection.end();
  } catch (error) {
    console.error('Gagal membuat database:', error.message);
  }
}
createDb();
