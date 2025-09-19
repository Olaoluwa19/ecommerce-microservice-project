import { Client } from "pg";

export const DBClient = () => {
  return new Client({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
  });
};

// import { Pool } from "pg";

// const pool = new Pool({
//   host: process.env.POSTGRES_HOST,
//   user: process.env.POSTGRES_USER,
//   database: process.env.POSTGRES_DB,
//   password: process.env.POSTGRES_PASSWORD,
//   port: 5432,
//   max: 20, // Maximum number of connections in the pool
//   idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
// });

// export const DBClient = () => pool;
