import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'srv1016.hstgr.io',
  user: process.env.DB_USER || 'u173227680_dev',
  password: process.env.DB_PASSWORD || 'Develop2025',
  database: process.env.DB_NAME || 'u173227680_dailyparcel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
   enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

export default pool;


//postgresql connection

// import {Pool} from 'pg';
// import 'dotenv/config';


// const pool = new Pool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'postgres',
//   password: process.env.DB_PASSWORD || 'raj@2415',
//   database: process.env.DB_NAME || 'srt_transport',
//   port: process.env.DB_PORT || 5432,
//   max: 10,               // Like connectionLimit in MySQL
//   idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
//   connectionTimeoutMillis: 2000 // How long to wait when connecting a new client
// });

// export default pool;
