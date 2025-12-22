import * as dotenv from "dotenv";
dotenv.config(); // Loads .env into process.env
import bodyParser from "@middy/http-json-body-parser";
import {
  BadRequest,
  CreatedResponse,
  ErrorResponse,
  InternalError,
  NotFound,
  SuccessResponse,
  Unauthorized,
} from "../utility/response.js";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/userRepository.js";
import { autoInjectable } from "tsyringe";
import { plainToClass } from "class-transformer";
import { SignupInput } from "../models/dto/SignupInput.js";
import { AppValidationError } from "../utility/errors.js";
import {
  GetSalt,
  GetHashedPassword,
  ValidatePassword,
  GetToken,
  VerifyToken,
} from "../utility/password.js";
import { LoginInput } from "../models/dto/LoginInput.js";
import { VerificationInput } from "../models/dto/UpdateInput.js";
import {
  GenerateAccessCode,
  SendVerificationCode,
} from "../utility/notification.js";
import { TimeDifference } from "../utility/dateHelper.js";
import { ProfileInput } from "../models/dto/AddressInput.js";

@autoInjectable()
export class UserService {
  repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  conditionalBodyParser = () => ({
    before: async (handler: any) => {
      const httpMethod = handler.event.requestContext.http.method.toLowerCase();
      if (["post", "put"].includes(httpMethod)) {
        await bodyParser().before(handler);
      }
    },
  });

  async ResponseWithError(event: APIGatewayProxyEventV2) {
    return ErrorResponse(404, "request Method is not supported!");
  }

  // User creation, validation and login.
  async CreateUser(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(SignupInput, event.body);
      const error = await AppValidationError(input);
      console.log(error);
      if (error) return ErrorResponse(404, error);

      const salt = await GetSalt();
      const hashedPassword = await GetHashedPassword(input.password, salt);
      const data = await this.repository.createAccount({
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
        userType: "BUYER",
        salt: salt,
      });
      return SuccessResponse(data);
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async UserLogin(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(LoginInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const data = await this.repository.findAccount(input.email);

      // check or validate password
      const verified = await ValidatePassword(
        input.password,
        data.password,
        data.salt
      );
      if (!verified) {
        throw new Error("password does not match!");
      }
      const token = GetToken(data);

      return SuccessResponse({ token });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async GetVerificationToken(event: APIGatewayProxyEventV2) {
    try {
      const headers = event.headers || {};
      const token = headers.authorization || headers.Authorization;
      console.log("Headers:", event.headers);

      if (!token) {
        return ErrorResponse(401, "Authorization header missing");
      }

      const payload = await VerifyToken(token);
      if (!payload) {
        return ErrorResponse(403, "Authorization failed");
      }

      const { code, expiry } = GenerateAccessCode();
      // save to DB to confirm verification
      await this.repository.updateVerificationCode(
        payload.user_id,
        code,
        expiry
      );
      console.log({ "Access code": code, "code expires in": expiry });
      // send code to user phone number
      // await SendVerificationCode(code, payload.phone);

      return SuccessResponse({
        message: "Verification code is sent to your registered phone number.",
      });
    } catch (error) {
      console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async VerifyUser(event: APIGatewayProxyEventV2) {
    try {
      const headers = event.headers || {};
      const token = headers.authorization || headers.Authorization;
      console.log("Headers:", event.headers);

      if (!token) {
        return ErrorResponse(401, "Authorization header missing");
      }

      const payload = await VerifyToken(token);
      if (!payload) {
        return ErrorResponse(403, "Authorization failed");
      }

      const input = plainToClass(VerificationInput, event.body);
      const errors = await AppValidationError(input);
      if (errors && errors.length > 0) {
        console.log("Validation errors:", errors);
        return BadRequest(errors);
      }

      const result = await this.repository.findAccount(payload.email);
      if ("statusCode" in result) {
        return result;
      }
      const { verification_code, expiry } = result;

      //find user by id and compare code
      if (verification_code === parseInt(input.code)) {
        // check if code is expired
        const currentTime = new Date();
        const diff = TimeDifference(
          expiry.toISOString(),
          currentTime.toISOString(),
          "m"
        );
        if (diff > 0) {
          console.log("Verified successfully");
          await this.repository.updateVerifyUser(payload.user_id);
        } else {
          return ErrorResponse(
            403,
            "Code has expired, please request new code"
          );
        }
      } else {
        return ErrorResponse(400, "Invalid verification code");
      }

      return SuccessResponse({ message: "User verified" });
    } catch (error) {
      console.log(error);
      return InternalError(error);
    }
  }

  // User profile
  async CreateProfile(event: APIGatewayProxyEventV2) {
    try {
      const headers = event.headers || {};
      const token = headers.authorization || headers.Authorization;
      console.log("Headers:", event.headers);
      if (!token) {
        return Unauthorized("Authorization header missing");
      }
      const payload = await VerifyToken(token);
      if (!payload) {
        return BadRequest("Authorization failed");
      }

      const input = plainToClass(ProfileInput, event.body);
      const errors = await AppValidationError(input);
      if (errors && errors.length > 0) {
        console.log("Validation errors:", errors);
        return BadRequest(errors);
      }

      const result = await this.repository.createProfile(
        payload.user_id,
        input
      );
      return result;
    } catch (error) {
      console.log(error);
      return InternalError(error);
    }
  }

  async GetProfile(event: APIGatewayProxyEventV2) {
    try {
      const headers = event.headers || {};
      const token = headers.authorization || headers.Authorization;
      console.log("Headers:", event.headers);
      if (!token) {
        return Unauthorized("Authorization header missing");
      }
      const payload = await VerifyToken(token);
      if (!payload) {
        return BadRequest("Authorization failed");
      }

      const result = await this.repository.getUserProfile(payload.user_id);
      return SuccessResponse(result);
    } catch (error) {
      console.log(error);
      return InternalError(error);
    }
  }

  async EditProfile(event: APIGatewayProxyEventV2) {
    try {
      const headers = event.headers || {};
      const token = headers.authorization || headers.Authorization;
      console.log("Headers:", event.headers);

      if (!token) {
        return NotFound("Authorization header missing");
      }

      const payload = await VerifyToken(token);
      if (!payload) return BadRequest("Authorization failed");

      const input = plainToClass(ProfileInput, event.body);
      const errors = await AppValidationError(input);
      if (errors && errors.length > 0) {
        console.log("Validation errors:", errors);
        return BadRequest(errors);
      }

      const result = await this.repository.editProfile(payload.user_id, input);
      return result;
    } catch (error) {
      console.log(error);
      return InternalError(error);
    }
  }
}
