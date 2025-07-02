import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME,
     waitForConnections: true,
     connectionLimit: 10,
     queueLimit: 0
});

const promisePool = pool.promise();

const testConnection = async () => {
     try {
          const [rows] = await promisePool.execute('SELECT 1');
          console.log('Database connection successful');
          console.log(rows);
     } catch (error) {
          console.error('Database connection failed:', error);
     }
}

export {testConnection, promisePool as pool};