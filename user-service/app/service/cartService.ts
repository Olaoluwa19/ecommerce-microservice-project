import bodyParser from "@middy/http-json-body-parser";
import {
  BadRequest,
  CreatedResponse,
  ErrorResponse,
  InternalError,
  NotFound,
  SuccessResponse,
} from "../utility/response.js";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ShoppingCartRepository } from "../repository/cartRepository.js";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors.js";
import { VerifyToken } from "../utility/password.js";
import { CartInput } from "../models/dto/CartInput.js";
import { CartItemModel } from "app/models/CartItemsModel.js";
import { PullData } from "app/message-queue/index.js";

export class CartService {
  repository: ShoppingCartRepository;

  constructor(repository: ShoppingCartRepository) {
    this.repository = repository;
  }

  conditionalBodyParser = () => ({
    before: async (handler: any) => {
      const httpMethod = handler.event.requestContext.http.method.toLowerCase();
      if (["post", "put"].includes(httpMethod)) {
        await bodyParser().before(handler);
      }
    },
  });

  async ResponseWithError(event: APIGatewayProxyEventV2) {
    return ErrorResponse(404, "request Method is not supported!");
  }

  // Cart Section
  async CreateCart(event: APIGatewayProxyEventV2) {
    try {
      const headers = event.headers || {};
      const token = headers.authorization || headers.Authorization;
      console.log("Headers:", event.headers);
      if (!token) {
        return NotFound("Authorization header missing");
      }
      const payload = await VerifyToken(token);
      if (!payload) return BadRequest("Authorization failed");

      const input = plainToClass(CartInput, event.body);
      const errors = await AppValidationError(input);
      if (errors && errors.length > 0) {
        console.log("Validation errors:", errors);
        return BadRequest(errors);
      }

      // Check if cart already exists for the user
      let currentCart = await this.repository.findCart(payload.user_id);
      if (!currentCart) {
        currentCart = await this.repository.createCart(payload.user_id);
      }
      if (!currentCart) {
        return BadRequest("Failed to create or retrieve shopping cart");
      }
      //check of item exist in cart and update quantity
      let currentProduct = await this.repository.findCartItemByProductId(
        input.productId
      );
      if (currentProduct) {
        //if exist update quantity
        await this.repository.updateCartItemByProductId(
          input.productId,
          (currentProduct.item_qty += input.qty)
        );
      } else {
        // if does not, call product service to get information
        const { data, status } = await PullData({
          action: "PULL_PRODUCT_DATA",
          productId: input.productId,
        });
        console.log("Getting Product", data);
        if (status !== 200) {
          return BadRequest("Failed to retrieve product information");
        }

        let cartItem = data.data as CartItemModel;
        cartItem.cart_id = currentCart.cart_id;
        cartItem.item_qty = input.qty;
        await this.repository.createCartItem(cartItem);
      }

      // Finally, return the created cart
      const cartItems = await this.repository.findCartItemsByCartId(
        currentCart.cart_id
      );

      return CreatedResponse(cartItems);
    } catch (error) {
      return InternalError(error);
    }
  }

  async UpdateCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from Update Cart" });
  }

  async GetCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from Get Cart" });
  }

  async DeleteCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from Get Cart" });
  }
}
