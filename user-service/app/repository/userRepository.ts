import { UserModel } from "../models/UserModel.js";
import { DBClient } from "../utility/databaseClient.js";
const { DBOperation } = await import("./dbOperation.js");

export class UserRepository extends DBOperation {
  constructor() {
    super();
  }

  async createAccount({
    email,
    password,
    salt,
    phone,
    userType,
    first_name,
    last_name,
  }: UserModel) {
    const queryString =
      "INSERT INTO users (phone, email, password, salt, user_type, first_name, last_name) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *"; //user_id, email, phone, user_type
    const values = [
      phone,
      email,
      password,
      salt,
      userType,
      first_name,
      last_name,
    ];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("Failed to create user");
  }

  async findAccount(email: string) {
    const queryString =
      "SELECT user_id, email, phone, password, salt, verification_code, expiry FROM users WHERE email = $1";
    const values = [email];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount < 1) {
      throw new Error("User does not exist with provided email id!");
    }
    return result.rows[0] as UserModel;
  }

  async updateVerificationCode(userId: string, code: number, expiry: Date) {
    const queryString =
      "UPDATE users SET verification_code=$1, expiry=$2 WHERE user_id=$3 AND verified=FALSE RETURNING *"; //user_id, email, phone, user_type
    const values = [code, expiry, userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("User is already verified");
  }

  async updateVerifyUser(userId: string) {
    const queryString =
      "UPDATE users SET verified=TRUE WHERE user_id=$1 AND verified=FALSE RETURNING *"; //user_id, email, phone, user_type
    const values = [userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("User is already verified");
  }
}
