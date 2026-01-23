import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import { container } from "../container.js";

const { userService } = container;

export const Signup = middy((event: APIGatewayProxyEventV2) => {
  return userService.CreateUser(event);
}).use(userService.conditionalBodyParser());

export const Login = middy((event: APIGatewayProxyEventV2) => {
  return userService.UserLogin(event);
}).use(userService.conditionalBodyParser());

export const GetVerificationCode = middy((event: APIGatewayProxyEventV2) => {
  return userService.GetVerificationToken(event);
}).use(userService.conditionalBodyParser());

export const Verify = middy((event: APIGatewayProxyEventV2) => {
  return userService.VerifyUser(event);
}).use(userService.conditionalBodyParser());

export const CreateProfile = middy((event: APIGatewayProxyEventV2) => {
  return userService.CreateProfile(event);
}).use(userService.conditionalBodyParser());

export const EditProfile = middy((event: APIGatewayProxyEventV2) => {
  return userService.EditProfile(event);
}).use(userService.conditionalBodyParser());

export const GetProfile = middy((event: APIGatewayProxyEventV2) => {
  return userService.GetProfile(event);
}).use(userService.conditionalBodyParser());
