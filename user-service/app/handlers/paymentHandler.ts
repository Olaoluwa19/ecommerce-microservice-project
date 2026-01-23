import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { container } from "../container.js";

const { paymentService } = container;

export const CreatePayment = middy((event: APIGatewayProxyEventV2) => {
  return paymentService.CreatePaymentMethod(event);
}).use(bodyParser());

export const EditPayment = middy((event: APIGatewayProxyEventV2) => {
  return paymentService.UpdatePaymentMethod(event);
}).use(bodyParser());

export const GetPayment = middy((event: APIGatewayProxyEventV2) => {
  return paymentService.GetPaymentMethod(event);
}).use(bodyParser());
