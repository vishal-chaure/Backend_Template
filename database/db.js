import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME,
     waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS,
     connectionLimit: process.env.DB_CONNECTION_LIMIT,
     queueLimit: process.env.DB_QUEUE_LIMIT,
     acquireTimeout: process.env.DB_ACQUIRE_TIMEOUT,
     timeout: process.env.DB_TIMEOUT,
     reconnect: process.env.DB_RECONNECT,
});

const promisePool = pool.promise();

const checkDatabaseHealth = async () => {
     try {
          const [rows] = await promisePool.execute('SELECT 1 as health');
          console.log('Database health check: OK');
          return true;
     } catch (error) {
          console.error('Database health check failed:', error);
          return false;
     }
};

setInterval(checkDatabaseHealth, 300000);

export { promisePool as pool, checkDatabaseHealth};