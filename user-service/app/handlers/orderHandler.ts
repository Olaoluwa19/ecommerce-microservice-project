import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { container } from "../container.js";

const { cartService } = container;

export const CollectPayment = middy((event: APIGatewayProxyEventV2) => {
  return cartService.CollectPayment(event);
}).use(cartService.conditionalBodyParser());

// export const GetOrders = middy((event: APIGatewayProxyEventV2) => {
//   return cartService.GetOrders(event);
// }).use(bodyParser());

// export const OrderById = middy((event: APIGatewayProxyEventV2) => {
//   return cartService.GetOrder(event);
// }).use(bodyParser());
