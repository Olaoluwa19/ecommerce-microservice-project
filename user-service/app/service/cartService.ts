import * as dotenv from "dotenv";
dotenv.config(); // Loads .env into process.env
import bodyParser from "@middy/http-json-body-parser";
import { ErrorResponse, SuccessResponse } from "../utility/response.js";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { CartRepository } from "../repository/cartRepository.js";
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
export class CartService {
  repository: CartRepository;

  constructor(repository: CartRepository) {
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

  // Cart Section
  async CreateCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from Create Cart" });
  }

  async UpdateCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from Update Cart" });
  }

  async GetCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from Get Cart" });
  }

  async DeleteCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from Get Cart" });
  }
}
