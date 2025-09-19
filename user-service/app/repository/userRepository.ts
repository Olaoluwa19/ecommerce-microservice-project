import { UserModel } from "../models/UserModel.js";
import { DBClient } from "../utility/databaseClient.js";

export class UserRepository {
  constructor() {}

  async createAccount({ email, password, salt, phone, userType }: UserModel) {
    const client = DBClient();
    await client.connect();

    const queryString =
      "INSERT INTO users (phone, email, password, salt, user_type) VALUES($1, $2, $3, $4, $5) RETURNING user_id, email, phone, user_type";
    const values = [phone, email, password, salt, userType];
    const result = await client.query(queryString, values);
    await client.end();
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("Failed to create user");
  }

  // async createAccount({ email, password, salt, phone, userType }: UserModel) {
  //   const client = DBClient();
  //   try {
  //     const queryString =
  //       "INSERT INTO users (phone, email, password, salt, user_type) VALUES($1, $2, $3, $4, $5) RETURNING user_id, email, phone, user_type";
  //     const values = [phone, email, password, salt, userType];
  //     const result = await client.query(queryString, values);
  //     if (result.rowCount > 0) {
  //       return result.rows[0] as UserModel;
  //     }
  //     throw new Error("Failed to create user");
  //   } finally {
  //     // No need to call client.end() with a pool
  //   }
  // }

  async findAccount(email: string) {
    const client = DBClient();
    await client.connect();

    const queryString =
      "SELECT user_id, email, phone, password, salt FROM users WHERE email = $1";
    const values = [email];
    const result = await client.query(queryString, values);
    await client.end();
    if (result.rowCount < 1) {
      throw new Error("User does not exist with provided email id!");
    }
    return result.rows[0] as UserModel;
  }
}
