import "reflect-metadata";
import { container } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserService } from "../service/userService.js";
import { ErrorResponse } from "../utility/response.js";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { UserRepository } from "app/repository/userRepository";

// Register UserRepository with the container
// container.register(UserRepository, { useClass: UserRepository });

const service = container.resolve(UserService);

export const Signup = middy((event: APIGatewayProxyEventV2) => {
  return service.CreateUser(event);
}).use(bodyParser());

export const Login = middy((event: APIGatewayProxyEventV2) => {
  return service.UserLogin(event);
}).use(bodyParser());

export const Verify = middy(async (event: APIGatewayProxyEventV2) => {
  return service.VerifyUser(event);
}).use(bodyParser());

export const Profile = middy(async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.CreateProfile(event);
  } else if (httpMethod === "put") {
    return service.EditProfile(event);
  } else if (httpMethod === "get") {
    return service.GetProfile(event);
  } else {
    return ErrorResponse(404, "request Method is not supported!");
  }
}).use(bodyParser());

export const Cart = middy(async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.CreateCart(event);
  } else if (httpMethod === "put") {
    return service.UpdateCart(event);
  } else if (httpMethod === "get") {
    return service.GetCart(event);
  } else {
    return ErrorResponse(404, "request Method is not supported!");
  }
}).use(bodyParser());

export const Payment = middy(async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.CreatePaymentMethod(event);
  } else if (httpMethod === "put") {
    return service.UpdatePaymentMethod(event);
  } else if (httpMethod === "get") {
    return service.GetPaymentMethod(event);
  } else {
    return ErrorResponse(404, "request Method is not supported!");
  }
}).use(bodyParser());
