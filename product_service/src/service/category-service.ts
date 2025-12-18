import { APIGatewayEvent } from "aws-lambda";
import { CategoryRepository } from "../repository/category-repository";
import {
  BadRequest,
  CreatedResponse,
  ErrorResponse,
  InternalError,
  NotFound,
  SuccessResponse,
} from "../utility/response";
import { CategoryInput } from "../dto/category-input";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors";

export class CategoryService {
  _repository: CategoryRepository;
  constructor(repository: CategoryRepository) {
    this._repository = repository;
  }

  async ResponseWithError(event: APIGatewayEvent) {
    return ErrorResponse(404, "request Method is not supported!");
  }

  async createCategory(event: APIGatewayEvent) {
    if (!event.body) {
      return BadRequest("Request body is required");
    }

    const input = plainToClass(CategoryInput, event.body);
    const errors = await AppValidationError(input);
    if (errors && errors.length > 0) {
      return BadRequest(errors);
    }
    const data = await this._repository.createCategory(input);
    return CreatedResponse(data);
  }

  async getCategories(event: APIGatewayEvent) {
    try {
      const type = event.queryStringParameters?.type;
      if (type === "top") {
        const data = await this._repository.getTopCategories();
        if (!data) {
          return NotFound("Top categories not found");
        }
        return SuccessResponse(data);
      }
      const data = await this._repository.getAllCategories();
      if (!data) {
        return NotFound("All categories not found");
      }
      return SuccessResponse(data);
    } catch (error) {
      return InternalError(error);
    }
  }

  async getCategory(event: APIGatewayEvent) {
    const categoryId = event.pathParameters?.id;
    if (!categoryId) return BadRequest("Category id is required");
    const data = await this._repository.getCategoryById(categoryId);
    if (!data) {
      return NotFound();
    }
    return SuccessResponse(data);
  }

  async editCategory(event: APIGatewayEvent) {
    const categoryId = event.pathParameters?.id;
    if (!categoryId) return BadRequest("Category id is required");

    const input = plainToClass(CategoryInput, event.body);
    const errors = await AppValidationError(input);
    if (errors && errors.length > 0) {
      return BadRequest(errors); // ← Now returns full, structured errors!
    }
    input.id = categoryId;
    const data = await this._repository.updateCategory(input);
    return SuccessResponse(data);
  }

  async deleteCategory(event: APIGatewayEvent) {
    const categoryId = event.pathParameters?.id;
    if (!categoryId) return BadRequest("Category id is required");
    const data = await this._repository.deleteCategory(categoryId);
    return SuccessResponse(data);
  }
}
