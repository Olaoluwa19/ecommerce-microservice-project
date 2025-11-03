import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ErrorResponse } from "./utility/response";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const isRoot = event.pathParameters === null

  switch (event.httpMethod.toLowerCase()) {
    case "post":
      if (isRoot) {
        //call create product service
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

  return ErrorResponse(404, "requetsted method not allowed")
};
