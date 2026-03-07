import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import { container } from "../container.js";

const { paymentService } = container;

export const CreatePayment = middy((event: APIGatewayProxyEventV2) => {
  return paymentService.CreatePaymentMethod(event);
}).use(paymentService.conditionalBodyParser());

export const EditPayment = middy((event: APIGatewayProxyEventV2) => {
  return paymentService.UpdatePaymentMethod(event);
}).use(paymentService.conditionalBodyParser());

export const GetPayment = middy((event: APIGatewayProxyEventV2) => {
  return paymentService.GetPaymentMethod(event);
}).use(paymentService.conditionalBodyParser());
