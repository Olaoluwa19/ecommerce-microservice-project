import { UserModel } from "../models/UserModel.js";
import { DBClient } from "../utility/databaseClient.js";

export class UserRepository {
  constructor() {}

  async createAccount({ email, password, salt, phone, userType }: UserModel) {
    const client = DBClient();
    await client.connect();

    const querryString =
      "INSERT INTO users (phone, email, password, salt, user_type) VALUES($1, $2, $3, $4, $5)";
    const values = [phone, email, password, salt, userType];
    const result = await client.query(querryString, values);
    await client.end();
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
  }
}
