import pg from "pg";

export const DBClient = () => {
  return new pg.Client({
    host: "127.0.0.1",
    user: "root",
    database: "user_service",
    password: "root",
    port: 5432,
  });
};
