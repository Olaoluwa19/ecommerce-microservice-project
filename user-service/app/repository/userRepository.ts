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

  async findAccount(email: string) {
    const client = DBClient();
    await client.connect();

    const querryString =
      "SELECT user_id, email, phone, salt, FROM users WHERE email = $1";
    const values = [email];
    const result = await client.query(querryString, values);
    await client.end();
    if (result.rowCount < 1) {
      throw new Error("User does not exist with provided email id!");
    }
    return result.rows[0] as UserModel;
  }
}
