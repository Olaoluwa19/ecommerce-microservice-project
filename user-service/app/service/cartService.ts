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
} from "../utility/response.js";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ShoppingCartRepository } from "../repository/cartRepository.js";
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
import { CartInput } from "../models/dto/CartInput.js";

@autoInjectable()
export class CartService {
  repository: ShoppingCartRepository;

  constructor(repository: ShoppingCartRepository) {
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
    try {
      const headers = event.headers || {};
      const token = headers.authorization || headers.Authorization;
      console.log("Headers:", event.headers);

      if (!token) {
        return NotFound("Authorization header missing");
      }

      const payload = await VerifyToken(token);
      if (!payload) return BadRequest("Authorization failed");

      const input = plainToClass(CartInput, event.body);
      const errors = await AppValidationError(input);
      if (errors && errors.length > 0) {
        console.log("Validation errors:", errors);
        return BadRequest(errors);
      }

      // Check if cart already exists for the user
      let currentCart = await this.repository.findShoppingCart(payload.user_id);
      if (!currentCart) {
        currentCart = await this.repository.createShoppingCart(payload.user_id);
      }

      //check of item exist in cart and update quantity

      return CreatedResponse({ message: "response from Create Cart" });
    } catch (error) {
      return InternalError(error);
    }
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
