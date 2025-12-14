import { APIGatewayEvent } from "aws-lambda";
import { CategoryRepository } from "../repository/category-repository";
import jsonBodyParser from "@middy/http-json-body-parser";
import { ErrorResponse } from "../utility/response";

export class CategoryService {
  _repsitory: CategoryRepository;
  constructor(repositry: CategoryRepository) {
    this._repsitory = repositry;
  }

  conditionalBodyParser = () => ({
    before: async (handler: any) => {
      const httpMethod = handler.event.requestContext.http.method.toLowerCase();
      if (["post", "put"].includes(httpMethod)) {
        await jsonBodyParser().before(handler);
      }
    },
  });

  async ResponseWithError(event: APIGatewayProxyEventV2) {
    return ErrorResponse(404, "request Method is not supported!");
  }

  async createCategory(event: APIGatewayEvent) {
    //   if (!event.body) {
    //     return BadRequest("Request body is required");
    //   }
    //   let payload;
    //   try {
    //     payload = JSON.parse(event.body);
    //   } catch (e) {
    //     return BadRequest("Invalid JSON");
    //   }
    //   const input = plainToClass(CategoryInput, payload);
    //   const errors = await AppValidationError(input);
    //   if (errors && errors.length > 0) {
    //     return BadRequest(errors); // ← Now returns full, structured errors!
    //   }
    //   const data = await this._repository.createCategory(input);
    //   return CreatedResponse(data); // ← 201 + proper body
  }

  async getCategories(event: APIGatewayEvent) {
    //   const data = await this._repository.getAllCategories();
    //   return SuccessResponse(data);
  }

  async getCategory(event: APIGatewayEvent) {
    //   const CategoryId = event.pathParameters?.id;
    //   if (!CategoryId) return ErrorResponse(403, "Category id is required");
    //   const data = await this._repository.getCategoryById(CategoryId);
    //   return SuccessResponse(data);
  }

  async editCategory(event: APIGatewayEvent) {
    //   const CategoryId = event.pathParameters?.id;
    //   if (!CategoryId) return ErrorResponse(403, "Category id is required");
    //   const input = plainToClass(CategoryInput, JSON.parse(event.body!));
    //   const error = await AppValidationError(input);
    //   console.log(error);
    //   if (error) return ErrorResponse(404, error);
    //   input.id = CategoryId;
    //   const data = await this._repository.updateCategory(input);
    //   return SuccessResponse(data);
  }

  async deleteCategory(event: APIGatewayEvent) {
    //   const CategoryId = event.pathParameters?.id;
    //   if (!CategoryId) return ErrorResponse(403, "Category id is required");
    //   const data = await this._repository.deleteCategory(CategoryId);
    //   return SuccessResponse(data);
  }
}
