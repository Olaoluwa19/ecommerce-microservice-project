import { UserModel } from "../models/UserModel.js";
import { ProfileInput } from "../models/dto/AddressInput.js";
const { DBOperation } = await import("./dbOperation.js");

export class UserRepository extends DBOperation {
  constructor() {
    super();
  }

  async createAccount({ email, password, salt, phone, userType }: UserModel) {
    const queryString =
      "INSERT INTO users (phone, email, password, salt, user_type) VALUES($1, $2, $3, $4, $5) RETURNING *";
    const values = [phone, email, password, salt, userType];
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

  async updateVerificationCode(userId: number, code: number, expiry: Date) {
    const queryString =
      "UPDATE users SET verification_code=$1, expiry=$2 WHERE user_id=$3 AND verified=FALSE RETURNING *"; //user_id, email, phone, user_type
    const values = [code, expiry, userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("User is already verified");
  }

  async updateVerifyUser(userId: number) {
    const queryString =
      "UPDATE users SET verified=TRUE WHERE user_id=$1 AND verified=FALSE RETURNING *"; //user_id, email, phone, user_type
    const values = [userId];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("User is already verified");
  }

  async updateUser(
    user_id: number,
    firstName: string,
    lastName: string,
    userType: string
  ) {
    const queryString =
      "UPDATE users SET first_name=$1, lastname=$2, user_type=$3 WHERE user_id=$4 RETURNING *"; //user_id, email, phone, user_type
    const values = [firstName, lastName, userType, user_id];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("error updating user profile");
  }

  async createProfile(
    user_id: number,
    {
      firstName,
      lastName,
      userType,
      address: { addressLine1, addressLine2, city, postCode, country },
    }: ProfileInput
  ) {
    const updateUser = await this.updateUser(
      user_id,
      firstName,
      lastName,
      userType
    );
    const queryString =
      "INSERT INTO address (user_id, address_line1, address_line2, city, post_code, country) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
    const values = [addressLine1, addressLine2, city, postCode, country];
    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    return true;
  }
}
