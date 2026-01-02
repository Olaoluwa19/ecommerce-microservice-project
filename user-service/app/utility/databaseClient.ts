import pg from "pg";
import fs from "fs";

export const DBClient = () => {
  try {
    return new pg.Client({
      host: process.env.host,
      user: process.env.user,
      database: process.env.database,
      password: process.env.password,
      port: process.env.port ? parseInt(process.env.port) : 5432,
      ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync("./global-bundle.pem").toString(),
      },
    });
  } catch (error) {
    throw new Error(error);
  }
};
