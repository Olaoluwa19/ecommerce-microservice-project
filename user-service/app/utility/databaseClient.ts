// app/utility/databaseClient.ts
import pg from "pg";

const client = new pg.Client({
  host: process.env.host,
  user: process.env.user,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port ? parseInt(process.env.port) : 5432,
  ssl: {
    rejectUnauthorized: false, // dev only
  },
});

// Connect once at startup
client
  .connect()
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1); // Fail fast in case of bad config
  });

// Export the already-connected singleton client
export const db = client;

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing DB connection...");
  await client.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await client.end();
  process.exit(0);
});
