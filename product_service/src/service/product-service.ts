import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import {
  BadRequest,
  CreatedResponse,
  ErrorResponse,
  SuccessResponse,
} from "../utility/response";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors";
import { ProductInput } from "../dto/product-input";

export class ProductService {
  _repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async createProduct(event: APIGatewayEvent) {
    if (!event.body) {
      return BadRequest("Request body is required");
    }

    let payload;
    try {
      payload = JSON.parse(event.body);
    } catch (e) {
      return BadRequest("Invalid JSON");
    }

    const input = plainToClass(ProductInput, payload);
    const errors = await AppValidationError(input);

    if (errors && errors.length > 0) {
      return BadRequest(errors); // ← Now returns full, structured errors!
    }

    const data = await this._repository.createProduct(input);
    return CreatedResponse(data); // ← 201 + proper body
  }

  // async createProduct(event: APIGatewayEvent) {
  //   // const input = plainToClass(ProductInput, JSON.parse(event.body!));
  //   // const error = await AppValidationError(input);
  //   // console.log(error);
  //   // if (error) return ErrorResponse(404, error);

  //   // const data = await this._repository.createProduct(input);

  //   // return SuccessResponse(data);

  //   if (!event.body) {
  //   return ErrorResponse(400, "Request body is required");
  // }

  // let body;
  // try {
  //   body = JSON.parse(event.body);
  // } catch (err) {
  //   return ErrorResponse(400, "Invalid JSON payload");
  // }

  // const input = plainToClass(ProductInput, body);
  // const errors = await AppValidationError(input);

  // if (errors && errors.length > 0) {
  //   return ErrorResponse(400, { message: "Validation failed", errors });
  // }

  // const data = await this._repository.createProduct(input);
  // return SuccessResponse(data, 201); // 201 Created is better for POST
  // }

  async getProducts(event: APIGatewayEvent) {
    const data = await this._repository.getAllProducts();
    return SuccessResponse(data);
  }

  async getProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "Product id is required");
    const data = await this._repository.getProductById(productId);
    return SuccessResponse(data);
  }

  async editProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "Product id is required");
    const input = plainToClass(ProductInput, JSON.parse(event.body!));
    const error = await AppValidationError(input);
    console.log(error);
    if (error) return ErrorResponse(404, error);

    input.id = productId;

    const data = await this._repository.updateProduct(input);

    return SuccessResponse(data);
  }

  async deleteProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return ErrorResponse(403, "Product id is required");
    const data = await this._repository.deleteProduct(productId);
    return SuccessResponse(data);
    return SuccessResponse({ msg: "delete Product" });
  }
}
