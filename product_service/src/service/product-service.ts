import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import {
  BadRequest,
  CreatedResponse,
  ErrorResponse,
  InternalError,
  NotFound,
  SuccessResponse,
} from "../utility/response";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors";
import { ProductInput } from "../dto/product-input";
import { CategoryRepository } from "../repository/category-repository";

export class ProductService {
  _repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async ResponseWithError(event: APIGatewayEvent) {
    return ErrorResponse(404, "request Method is not supported!");
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
      console.log("Validation errors:", errors);
      return BadRequest(errors);
    }

    const data = await this._repository.createProduct(input);
    if (!data) {
      return InternalError("Failed to create product");
    }

    const categoryProduct = await new CategoryRepository().addItem({
      id: input.category_id,
      products: [data._id as string],
    });
    return CreatedResponse(categoryProduct);
  }

  async getProducts(event: APIGatewayEvent) {
    const data = await this._repository.getAllProducts();
    if (data.length === 0) {
      return NotFound("No products found");
    }
    return SuccessResponse(data);
  }

  async getProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return BadRequest("Product id is required");
    const data = await this._repository.getProductById(productId);
    if (data.length === 0) {
      return NotFound("No products found");
    }
    return SuccessResponse(data);
  }

  async editProduct(event: APIGatewayEvent) {
    const productId = event.pathParameters?.id;
    if (!productId) return BadRequest("Product id is required");
    const input = plainToClass(ProductInput, JSON.parse(event.body!));
    const errors = await AppValidationError(input);

    if (errors && errors.length > 0) {
      console.log("Validation errors:", errors);
      return BadRequest(errors);
    }

    input.id = productId;

    const data = await this._repository.updateProduct(input);

    return CreatedResponse(data);
  }

  async deleteProduct(event: APIGatewayEvent) {
    try {
      const productId = event.pathParameters?.id;
      if (!productId) return BadRequest("Product id is required");

      const result = await this._repository.deleteProduct(productId);
      // Check if it's an error response (all error responses have statusCode)
      if ("statusCode" in result) {
        return result; // It's BadRequest, NotFound, or InternalError
      }

      const { deleteResult, category_id } = result;

      await new CategoryRepository().removeItem({
        id: category_id,
        products: [productId],
      });
      return SuccessResponse(deleteResult);
    } catch (error) {
      return InternalError(error);
    }
  }
}
