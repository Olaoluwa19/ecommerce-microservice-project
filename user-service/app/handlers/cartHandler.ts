import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import { container } from "../container";

const { cartService } = container;

export const CreateCart = middy((event: APIGatewayProxyEventV2) => {
  return cartService.CreateCart(event);
}).use(cartService.conditionalBodyParser());

export const DeleteCart = middy((event: APIGatewayProxyEventV2) => {
  return cartService.DeleteCart(event);
}).use(cartService.conditionalBodyParser());

export const EditCart = middy((event: APIGatewayProxyEventV2) => {
  return cartService.UpdateCart(event);
}).use(cartService.conditionalBodyParser());

export const GetCart = middy((event: APIGatewayProxyEventV2) => {
  return cartService.GetCart(event);
}).use(cartService.conditionalBodyParser());
