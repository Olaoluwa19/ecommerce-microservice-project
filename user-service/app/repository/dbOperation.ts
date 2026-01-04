// app/repository/dbOperation.ts
import { db } from "../utility/databaseClient.js"; // ← Import the singleton

export class DBOperation {
  constructor() {}

  async executeQuery(queryString: string, values: unknown[] = []) {
    try {
      // Use the already-connected shared client
      const result = await db.query(queryString, values);
      return result;
    } catch (error) {
      console.error("Query failed:", queryString, values, error);
      throw error; // Let caller handle it
    }
  }
}
