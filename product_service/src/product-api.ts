import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ErrorResponse } from "./utility/response";
import { ProductService } from "./service/product-service";
import { ProductRepository } from "./repository/product-repository";

const service = new ProductService(new ProductRepository());

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const isRoot = event.pathParameters === null;

  switch (event.httpMethod.toLowerCase()) {
    case "post":
      if (isRoot) {
        return service.createProduct();
      }
      break;
    case "get":
    // return isRoot ? " // call get Products" : "call get product by id"
    case "put":
      if (!isRoot) {
        // call edit product
      }
    case "delete":
      if (!isRoot) {
        // delete product
      }
  }

  return ErrorResponse(404, "requetsted method not allowed");
};
