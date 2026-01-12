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
import { UserRepository } from "../repository/userRepository";
import { plainToClass } from "class-transformer";
import { SignupInput } from "../models/dto/SignupInput";
import { AppValidationError } from "../utility/errors";
import {
  GetSalt,
  GetHashedPassword,
  ValidatePassword,
  GetToken,
  VerifyToken,
} from "../utility/password";
import { LoginInput } from "../models/dto/LoginInput";
import { VerificationInput } from "../models/dto/UpdateInput";
import {
  GenerateAccessCode,
  SendVerificationCode,
} from "../utility/notification";
import { TimeDifference } from "../utility/dateHelper";
import { ProfileInput } from "../models/dto/AddressInput";

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
      const errors = await AppValidationError(input);
      if (errors && errors.length > 0) {
        console.log("Validation errors:", errors);
        return BadRequest(errors);
      }
      const salt = await GetSalt();
      if (!salt) {
        return BadRequest("Error generating salt for password hashing");
      }
      const hashedPassword = await GetHashedPassword(input.password, salt);
      const data = await this.repository.createAccount({
        email: input.email,
        password: hashedPassword,
        phone: input.phone,
        userType: input.userType,
        salt: salt,
      });
      return CreatedResponse(data);
    } catch (error) {
      return InternalError(error);
    }
  }

  async UserLogin(event: APIGatewayProxyEventV2) {
    try {
      const input = plainToClass(LoginInput, event.body);
      const errors = await AppValidationError(input);
      if (errors && errors.length > 0) {
        console.log("Validation errors:", errors);
        return BadRequest(errors);
      }

      const data = await this.repository.findAccount(input.email);
      // check or validate password
      const verified = await ValidatePassword(
        input.password,
        data.password,
        data.salt
      );
      if (!verified) {
        return Unauthorized("password does not match!");
      }
      const token = GetToken(data);

      return SuccessResponse({ token });
    } catch (error) {
      return InternalError(error);
    }
  }

  async GetVerificationToken(event: APIGatewayProxyEventV2) {
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
      return InternalError(error);
    }
  }

  async VerifyUser(event: APIGatewayProxyEventV2) {
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

      const input = plainToClass(VerificationInput, event.body);
      const errors = await AppValidationError(input);
      if (errors && errors.length > 0) {
        console.log("Validation errors:", errors);
        return BadRequest(errors);
      }

      const result = await this.repository.findAccount(payload.email);
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
          return Unauthorized("Code has expired, please request new code");
        }
      } else {
        return BadRequest("Invalid verification code");
      }

      return SuccessResponse({ message: "User verified" });
    } catch (error) {
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
      return CreatedResponse(result);
    } catch (error) {
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
      return CreatedResponse(result);
    } catch (error) {
      return InternalError(error);
    }
  }
}
