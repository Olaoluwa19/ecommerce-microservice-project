import * as dotenv from "dotenv";
dotenv.config(); // Loads .env into process.env
import bodyParser from "@middy/http-json-body-parser";
import { ErrorResponse, SuccessResponse } from "../utility/response.js";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { PaymentRepository } from "../repository/paymentRepository.js";
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
export class PaymentService {
  repository: PaymentRepository;

  constructor(repository: PaymentRepository) {
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

  // Payment Section
  async CreatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from Create Payment Method" });
  }

  async UpdatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from Update Payment Method" });
  }

  async GetPaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from Get Payment Method" });
  }
}
