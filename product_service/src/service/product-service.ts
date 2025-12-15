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
      return BadRequest(errors);
    }

    const data = await this._repository.createProduct(input);
    return CreatedResponse(data);
  }

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
  }
}
