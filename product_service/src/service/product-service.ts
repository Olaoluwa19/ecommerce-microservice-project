import { APIGatewayEvent, APIGatewayProxyEvent } from "aws-lambda";
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
import { ServiceInput } from "../dto/service-input";
import { Types } from "mongoose";

export class ProductService {
  _repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async ResponseWithError(event: APIGatewayEvent) {
    return ErrorResponse(404, "request Method is not supported!");
  }

  async createProduct(event: APIGatewayEvent) {
    try {
      const input = plainToClass(ProductInput, event.body);
      const errors = await AppValidationError(input);
      if (errors && errors.length > 0) {
        console.log("Validation errors:", errors);
        return BadRequest(errors);
      }
      const categoryExists = await new CategoryRepository().getCategoryById(
        input.category_id
      );
      if (!Types.ObjectId.isValid(categoryExists)) {
        return BadRequest("Invalid category ID format");
      }
      if (!categoryExists) {
        return NotFound("Category not found");
      }
      const data = await this._repository.createProduct(input);
      await new CategoryRepository().addItem({
        id: input.category_id,
        products: [data._id as string],
      });
      return CreatedResponse(data);
    } catch (error) {
      return InternalError(error);
    }
  }

  async getProducts(event: APIGatewayEvent) {
    try {
      const data = await this._repository.getAllProducts();
      if (data.length === 0) {
        return NotFound("No products found");
      }
      return SuccessResponse(data);
    } catch (error) {
      return InternalError(error);
    }
  }

  async getProduct(event: APIGatewayEvent) {
    try {
      const productId = event.pathParameters?.id;
      if (!productId) return BadRequest("Product id is required");
      if (!Types.ObjectId.isValid(productId)) {
        return BadRequest("Invalid product ID format");
      }
      const data = await this._repository.getProductById(productId);
      if (!data) {
        return NotFound("No products found");
      }
      return SuccessResponse(data);
    } catch (error) {
      return InternalError(error);
    }
  }

  async editProduct(event: APIGatewayEvent) {
    try {
      const productId = event.pathParameters?.id;
      if (!productId) return BadRequest("Product id is required");
      if (!Types.ObjectId.isValid(productId)) {
        return BadRequest("Invalid product ID format");
      }
      const existingProduct = await this._repository.getProductById(productId);
      if (!existingProduct) {
        return NotFound("Product not found");
      }
      const input = plainToClass(ProductInput, event.body);
      const errors = await AppValidationError(input);
      if (errors && errors.length > 0) {
        console.log("Validation errors:", errors);
        return BadRequest(errors);
      }

      input.id = productId;
      const data = await this._repository.updateProduct(input);
      return CreatedResponse(data);
    } catch (error) {
      return InternalError(error);
    }
  }

  async deleteProduct(event: APIGatewayEvent) {
    try {
      const productId = event.pathParameters?.id;
      if (!productId) return BadRequest("Product id is required");
      const result = await this._repository.deleteProduct(productId);
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

  // TODO: http calls will be converted to RPC and Queue later
  async handleQueueOperation(event: APIGatewayProxyEvent) {
    try {
      if (!event.body) {
        return BadRequest("Request body is required");
      }
      const input = plainToClass(ServiceInput, event.body);

      const errors = await AppValidationError(input);
      if (errors && errors.length > 0) {
        console.log("Validation errors:", errors);
        return BadRequest(errors);
      }
      console.log("Service Input:", input);

      const data = await this._repository.getProductById(input.productId);
      const { _id, name, price, image_url } = data;
      console.log("Product Data:", data);

      return SuccessResponse({ product_id: _id, name, price, image_url });
    } catch (error) {
      return InternalError(error);
    }
  }
}
