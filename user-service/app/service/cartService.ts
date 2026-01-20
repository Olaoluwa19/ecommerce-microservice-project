import bodyParser from "@middy/http-json-body-parser";
import aws from "aws-sdk";
import {
  BadRequest,
  CreatedResponse,
  ErrorResponse,
  InternalError,
  NotFound,
  SuccessResponse,
  Unauthorized,
} from "../utility/response.js";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { ShoppingCartRepository } from "../repository/cartRepository";
import { plainToClass } from "class-transformer";
import { AppValidationError } from "../utility/errors";
import { VerifyToken } from "../utility/password";
import { CartInput, UpdateCartInput } from "../models/dto/CartInput";
import { CartItemModel } from "../models/CartItemsModel";
import { PullData } from "../message-queue/index";

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

  async CreateCart(event: APIGatewayProxyEventV2) {
    try {
      const headers = event.headers || {};
      const token = headers.authorization || headers.Authorization;

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
        input.productId,
      );
      if (currentProduct) {
        //if exist update quantity
        await this.repository.updateCartItemByProductId(
          input.productId,
          (currentProduct.item_qty += input.qty),
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
        currentCart.cart_id,
      );

      return CreatedResponse(cartItems);
    } catch (error) {
      return InternalError(error);
    }
  }

  async GetCart(event: APIGatewayProxyEventV2) {
    try {
      const headers = event.headers || {};
      const token = headers.authorization || headers.Authorization;
      if (!token) {
        return Unauthorized("Authorization header missing");
      }
      const payload = await VerifyToken(token);
      if (!payload) return BadRequest("Authorization failed");

      const result = await this.repository.findCartItems(payload.user_id);
      return SuccessResponse(result);
    } catch (error) {
      return InternalError(error);
    }
  }

  async UpdateCart(event: APIGatewayProxyEventV2) {
    try {
      const headers = event.headers || {};
      const token = headers.authorization || headers.Authorization;

      if (!token) {
        return NotFound("Authorization header missing");
      }
      const payload = await VerifyToken(token);
      if (!payload) return BadRequest("Authorization failed");
      const cartItemId = Number(event.pathParameters?.id);
      if (!cartItemId) {
        return BadRequest("cartItemId path parameter is required");
      }

      const input = plainToClass(UpdateCartInput, event.body);
      const errors = await AppValidationError(input);
      if (errors && errors.length > 0) {
        console.log("Validation errors:", errors);
        return BadRequest(errors);
      }
      const cartItem = await this.repository.updateCartItemById(
        cartItemId,
        input.qty,
      );

      if (!cartItem) {
        return NotFound("Cart item not found");
      }

      return CreatedResponse(cartItem);
    } catch (error) {
      return InternalError(error);
    }
  }

  async DeleteCart(event: APIGatewayProxyEventV2) {
    try {
      const headers = event.headers || {};
      const token = headers.authorization || headers.Authorization;
      if (!token) {
        return NotFound("Authorization header missing");
      }
      const payload = await VerifyToken(token);
      if (!payload) return BadRequest("Authorization failed");
      const cartItemId = Number(event.pathParameters?.id);
      if (!cartItemId) {
        return BadRequest("cartItemId path parameter is required");
      }

      const deletedItem = await this.repository.deleteCartItem(cartItemId);
      return SuccessResponse(deletedItem);
    } catch (error) {
      return InternalError(error);
    }
  }

  async CollectPayment(event: APIGatewayProxyEventV2) {
    try {
      // initialize payment gateway
      const headers = event.headers || {};
      const token = headers.authorization || headers.Authorization;
      if (!token) {
        return Unauthorized("Authorization header missing");
      }

      // autheticate payment confirmation

      // get cart items
      const payload = await VerifyToken(token);
      if (!payload) return BadRequest("Authorization failed");

      const cartItems = await this.repository.findCartItems(payload.user_id);

      // send SNS topic to create order [transaction microservice] => email to user
      const params = {
        Message: JSON.stringify(cartItems),
        TopicArn: process.env.SNS_TOPIC || "",
        MessageAttributes: {
          actionType: {
            DataType: "String",
            StringValue: "place_order",
          },
        },
      };
      const sns = new aws.SNS();
      const response = await sns.publish(params).promise();

      //send tentative message to user
      return SuccessResponse({ msg: "Payment processing...", response });
    } catch (error) {
      return InternalError(error);
    }
  }
}
