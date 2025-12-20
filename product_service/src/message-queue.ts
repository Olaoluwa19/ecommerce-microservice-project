import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ProductService } from "./service/product-service";
import { ProductRepository } from "./repository/product-repository";
import { connectDB } from "./utility/mongodb";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";
import httpEventNormalizer from "@middy/http-event-normalizer";

const service = new ProductService(new ProductRepository());

export const baseHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  await connectDB();
};

export const handler = middy(baseHandler)
  .use(httpEventNormalizer())
  .use(
    jsonBodyParser({
      disableContentTypeError: true, // Allows GET/DELETE with stray Content-Type: application/json
    })
  );
