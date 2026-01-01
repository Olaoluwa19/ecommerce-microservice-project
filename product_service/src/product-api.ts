import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { BadRequest } from "./utility/response";
import { ProductService } from "./service/product-service";
import { ProductRepository } from "./repository/product-repository";
import { connectDB } from "./utility/mongodb";
import middy from "@middy/core";
import httpEventNormalizer from "@middy/http-event-normalizer";
import jsonBodyParser from "@middy/http-json-body-parser";

const service = new ProductService(new ProductRepository());

export const baseHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  await connectDB();

  const categoryId = event.pathParameters?.id;
  const isRoot = !categoryId;

  switch (event.httpMethod.toLowerCase()) {
    case "post":
      if (isRoot) {
        return service.createProduct(event);
      }
      break;
    case "get":
      return isRoot ? service.getProducts(event) : service.getProduct(event);
    case "put":
      if (!isRoot) {
        return service.editProduct(event);
      }
    case "delete":
      if (!isRoot) {
        return service.deleteProduct(event);
      }
  }

  return BadRequest("requested method not allowed");
};

export const handler = middy(baseHandler)
  .use(httpEventNormalizer())
  .use(
    jsonBodyParser({
      disableContentTypeError: true, // Allows GET/DELETE with stray Content-Type: application/json
    })
  );
