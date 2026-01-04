import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { container } from "../container.js";

const { userService, cartService, paymentService } = container;

export const Signup = middy((event: APIGatewayProxyEventV2) => {
  return userService.CreateUser(event);
}).use(bodyParser());

export const Login = middy((event: APIGatewayProxyEventV2) => {
  return userService.UserLogin(event);
}).use(bodyParser());

export const Verify = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return userService.VerifyUser(event);
  } else if (httpMethod === "get") {
    return userService.GetVerificationToken(event);
  } else {
    return userService.ResponseWithError(event);
  }
}).use(userService.conditionalBodyParser());

export const Profile = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return userService.CreateProfile(event);
  } else if (httpMethod === "put") {
    return userService.EditProfile(event);
  } else if (httpMethod === "get") {
    return userService.GetProfile(event);
  } else {
    return userService.ResponseWithError(event);
  }
}).use(userService.conditionalBodyParser());

export const Cart = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") return cartService.CreateCart(event);
  if (httpMethod === "put") return cartService.UpdateCart(event);
  if (httpMethod === "get") return cartService.GetCart(event);
  if (httpMethod === "delete") return cartService.DeleteCart(event);
  return cartService.ResponseWithError(event);
  // const httpMethod = event.requestContext.http.method.toLowerCase();
  // if (httpMethod === "post") {
  //   return cartService.CreateCart(event);
  // } else if (httpMethod === "put") {
  //   return cartService.UpdateCart(event);
  // } else if (httpMethod === "get") {
  //   return cartService.GetCart(event);
  // } else if (httpMethod === "delete") {
  //   return cartService.DeleteCart(event);
  // } else {
  //   return cartService.ResponseWithError(event);
  // }
}).use(userService.conditionalBodyParser());

export const Payment = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") return paymentService.CreatePaymentMethod(event);
  if (httpMethod === "put") return paymentService.UpdatePaymentMethod(event);
  if (httpMethod === "get") return paymentService.GetPaymentMethod(event);
  return paymentService.ResponseWithError(event);
  // const httpMethod = event.requestContext.http.method.toLowerCase();
  // if (httpMethod === "post") {
  //   return paymentService.CreatePaymentMethod(event);
  // } else if (httpMethod === "put") {
  //   return paymentService.UpdatePaymentMethod(event);
  // } else if (httpMethod === "get") {
  //   return paymentService.GetPaymentMethod(event);
  // } else {
  //   return paymentService.ResponseWithError(event);
  // }
}).use(userService.conditionalBodyParser());
