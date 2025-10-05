import * as dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel.js";

const APP_SECRET = process.env.APP_SECRET;

export const GetSalt = async () => {
  return await bcrypt.genSalt();
};

export const GetHashedPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  salt: string
) => {
  return (await GetHashedPassword(enteredPassword, salt)) == savedPassword;
};

export const GetToken = ({ email, user_id, phone, userType }: UserModel) => {
  return jwt.sign(
    {
      user_id,
      email,
      phone,
      userType,
    },
    APP_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export const VerifyToken = async (
  token: string | undefined
): Promise<UserModel | false> => {
  try {
    if (!token) {
      console.log("No token provided");
      return false;
    }

    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      console.log("Invalid token format");
      return false;
    }

    const payload = jwt.verify(tokenParts[1], APP_SECRET);
    return payload as UserModel;
  } catch (error) {
    console.error("Token verification error:", error);
    return false;
  }
};

// export const VerifyToken = async (
//   token: string
// ): Promise<UserModel | false> => {
//   try {
//     if (token !== "") {
//       const payload =  jwt.verify(token.split(" ")[1], APP_SECRET);
//       return payload as UserModel;
//     }
//     return false;
//   } catch (error) {
//     console.log(error);
//     return false;
//   }
// };
