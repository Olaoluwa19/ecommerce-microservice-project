import { APIGateWayEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors";
import { ProductInput } from "../dto/product-input";

export class ProductService {
  _repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async createProduct(event: APIGateWayEvent) {
    const input = plainToClass(ProductInput, event.body);
    const error = await AppValidationError(input);
    console.log(error);
    if (error) return ErrorResponse(404, error);

    const data = await this._repository.createProduct(input);

    return SuccessResponse(data);
  }

  async getProducts(event: APIGateWayEvent) {
    return SuccessResponse({ msg: "get Products" });
  }

  async getProduct(event: APIGateWayEvent) {
    return SuccessResponse({ msg: "get Product by id" });
  }

  async editProduct(event: APIGateWayEvent) {
    return SuccessResponse({ msg: "edit Product" });
  }

  async deleteProduct(event: APIGateWayEvent) {
    return SuccessResponse({ msg: "delete Product" });
  }
}
