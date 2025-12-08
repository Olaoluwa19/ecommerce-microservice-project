import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ErrorResponse } from "./utility/response";
import { ProductService } from "./service/product-service";
import { ProductRepository } from "./repository/product-repository";
import { connectDB } from "./utility/mongodb";

const service = new ProductService(new ProductRepository());

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  await connectDB();

  const isRoot = event.pathParameters === null;

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

  return ErrorResponse(404, "requetsted method not allowed");
};

// import { APIGatewayProxyHandler } from "aws-lambda";
// import { ProductService } from "./service/product-service";
// import { ProductRepository } from "./repository/product-repository";

// const service = new ProductService(new ProductRepository());

// export const handler: APIGatewayProxyHandler = async (event) => {
//   await connectDB();

//   const hasPathParams =
//     event.pathParameters && Object.keys(event.pathParameters).length > 0;

//   switch (event.httpMethod.toUpperCase()) {
//     case "POST":
//       if (!hasPathParams) return service.createProduct(event);
//       break;

//     case "GET":
//       if (!hasPathParams) return service.getProducts(event);
//       else return service.getProduct(event);

//     case "PUT":
//       if (hasPathParams) return service.editProduct(event);
//       break;

//     case "DELETE":
//       if (hasPathParams) return service.deleteProduct(event);
//       break;
//   }

//   return ErrorResponse(404, "Method Not Allowed");
// };
