import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ErrorResponse } from "./utility/response";
import { CategoryService } from "./service/category-service";
import { CategoryRepository } from "./repository/category-repository";
import { connectDB } from "./utility/mongodb";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";

const service = new CategoryService(new CategoryRepository());

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
        return service.createCategory(event);
      }
      break;
    case "get":
      return isRoot ? service.getCategories(event) : service.getCategory(event);
    case "put":
      if (!isRoot) {
        return service.editCategory(event);
      }
      break;
    case "delete":
      if (!isRoot) {
        return service.deleteCategory(event);
      }
      break;
  }

  return service.ResponseWithError(event);
};

export const handler = middy(baseHandler)
  .use(httpEventNormalizer())
  .use(
    jsonBodyParser({
      disableContentTypeError: true, // Allows GET/DELETE with stray Content-Type: application/json
    })
  );
