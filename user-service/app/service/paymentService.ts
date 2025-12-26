import bodyParser from "@middy/http-json-body-parser";
import { ErrorResponse, SuccessResponse } from "../utility/response.js";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { PaymentRepository } from "../repository/paymentRepository.js";
import { autoInjectable } from "tsyringe";

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
