import {
  BadRequest,
  CreatedResponse,
  InternalError,
} from "app/utility/response.js";
import { AddressModel } from "../models/AddressModel.js";
import { UserModel } from "../models/UserModel.js";
import { ProfileInput } from "../models/dto/AddressInput.js";
const { DBOperation } = await import("./dbOperation.js");

export class UserRepository extends DBOperation {
  constructor() {
    super();
  }

  async createAccount({ email, password, salt, phone, userType }: UserModel) {
    try {
      const queryString =
        "INSERT INTO users (phone, email, password, salt, user_type) VALUES($1, $2, $3, $4, $5) RETURNING *";
      if (!queryString) return BadRequest("Invalid query string");
      const values = [phone, email, password, salt, userType];
      const result = await this.executeQuery(queryString, values);
      if ("statusCode" in result) {
        return result;
      }
      if (result.rowCount > 0) {
        const data = result.rows[0] as UserModel;
        return CreatedResponse(data);
      }
      return BadRequest("Failed to create user");
    } catch (error) {
      return InternalError(error);
    }
  }

  async findAccount(email: string) {
    try {
      const queryString =
        "SELECT user_id, email, phone, password, salt, verification_code, expiry FROM users WHERE email = $1";
      if (!queryString) return BadRequest("Invalid query string");
      const values = [email];
      const result = await this.executeQuery(queryString, values);
      if ("statusCode" in result) {
        return result;
      }
      if (result.rowCount < 1) {
        return BadRequest("User does not exist with provided email id!");
      }
      return result.rows[0] as UserModel;
    } catch (error) {
      return InternalError(error);
    }
  }

  async updateVerificationCode(userId: number, code: number, expiry: Date) {
    try {
      const queryString =
        "UPDATE users SET verification_code=$1, expiry=$2 WHERE user_id=$3 AND verified=FALSE RETURNING *"; //user_id, email, phone, user_type
      if (!queryString) return BadRequest("Invalid query string");
      const values = [code, expiry, userId];
      const result = await this.executeQuery(queryString, values);
      if ("statusCode" in result) {
        return result;
      }
      if (result.rowCount > 0) {
        const data = result.rows[0] as UserModel;
        return CreatedResponse(data);
      }
      return BadRequest("User is already verified");
    } catch (error) {
      return InternalError(error);
    }
  }

  async updateVerifyUser(userId: number) {
    try {
      const queryString =
        "UPDATE users SET verified=TRUE WHERE user_id=$1 AND verified=FALSE RETURNING *"; //user_id, email, phone, user_type
      if (!queryString) return BadRequest("Invalid query string");
      const values = [userId];
      const result = await this.executeQuery(queryString, values);
      if ("statusCode" in result) {
        return result;
      }
      if (result.rowCount > 0) {
        const data = result.rows[0] as UserModel;
        return CreatedResponse(data);
      }
      return BadRequest("User is already verified");
    } catch (error) {
      return InternalError(error);
    }
  }

  async updateUser(
    user_id: number,
    firstName: string,
    lastName: string,
    userType: string
  ) {
    try {
      const queryString =
        "UPDATE users SET first_name=$1, last_name=$2, user_type=$3 WHERE user_id=$4 RETURNING *";
      if (!queryString) return BadRequest("Invalid query string");
      const values = [firstName, lastName, userType, user_id];
      const result = await this.executeQuery(queryString, values);
      if ("statusCode" in result) {
        return result;
      }
      if (result.rowCount > 0) {
        const data = result.rows[0] as UserModel;
        return CreatedResponse(data);
      }
      return BadRequest("error updating user profile");
    } catch (error) {
      return InternalError(error);
    }
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
    try {
      await this.updateUser(user_id, firstName, lastName, userType);
      const queryString =
        "INSERT INTO address (user_id, address_line1, address_line2, city, post_code, country) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
      if (!queryString) return BadRequest("Invalid query string");
      const values = [
        user_id,
        addressLine1,
        addressLine2,
        city,
        postCode,
        country,
      ];
      const result = await this.executeQuery(queryString, values);
      if ("statusCode" in result) {
        return result;
      }
      if (result.rowCount > 0) {
        const data = result.rows[0] as AddressModel;
        return CreatedResponse(data);
      }
      return BadRequest("error creating user profile");
    } catch (error) {
      return InternalError(error);
    }
  }

  async getUserProfile(user_id: number) {
    try {
      const profileQuery =
        "SELECT first_name, last_name, email, phone, user_type, verified FROM users WHERE user_id=$1";
      if (!profileQuery) return BadRequest("Invalid query string");
      const profileValues = [user_id];
      const profileResult = await this.executeQuery(
        profileQuery,
        profileValues
      );
      if ("statusCode" in profileResult) {
        return profileResult;
      }
      if (profileResult.rowCount < 1) {
        throw new Error("User profile does not exist");
      }

      const userProfile = profileResult.rows[0] as UserModel;

      const addressQuery =
        "SELECT id, address_line1, address_line2, city, post_code, country FROM address WHERE user_id=$1";
      const addressValues = [user_id];

      const addressResult = await this.executeQuery(
        addressQuery,
        addressValues
      );
      if ("statusCode" in addressResult) {
        return addressResult;
      }
      if (addressResult.rowCount > 0) {
        userProfile.address = addressResult.rows as AddressModel[];
      }
      return CreatedResponse(userProfile);
    } catch (error) {
      return InternalError(error);
    }
  }

  async editProfile(
    user_id: number,
    {
      firstName,
      lastName,
      userType,
      address: { addressLine1, addressLine2, city, postCode, country, id },
    }: ProfileInput
  ) {
    try {
      await this.updateUser(user_id, firstName, lastName, userType);

      const addressQuery =
        "UPDATE  address SET address_line1=$1, address_line2=$2, city=$3, post_code=$4, country=$5 WHERE user_id=$6 RETURNING *";
      if (!addressQuery) return BadRequest("Invalid query string");
      const addressValues = [
        addressLine1,
        addressLine2,
        city,
        postCode,
        country,
        id,
      ];

      const addressResult = await this.executeQuery(
        addressQuery,
        addressValues
      );
      if ("statusCode" in addressResult) {
        return addressResult;
      }
      if (addressResult.rowCount < 1) {
        return BadRequest("Error while updating profile!");
      }
      return true;
    } catch (error) {
      return InternalError(error);
    }
  }
}
