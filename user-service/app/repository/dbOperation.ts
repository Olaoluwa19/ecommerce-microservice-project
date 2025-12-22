import { InternalError } from "app/utility/response.js";
import { DBClient } from "../utility/databaseClient.js";

export class DBOperation {
  constructor() {}

  async executeQuery(queryString: string, values: unknown[]) {
    try {
      const client = DBClient();
      await client.connect();
      const result = await client.query(queryString, values);
      await client.end();
      return result;
    } catch (error) {
      return InternalError(error);
    }
  }
}
