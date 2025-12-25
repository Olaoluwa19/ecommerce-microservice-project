import {
  BadRequest,
  CreatedResponse,
  InternalError,
} from "app/utility/response.js";
import { AddressModel } from "../models/AddressModel.js";
import { ShoppingCartModel } from "../models/ShoppingCartModel.js";
import { CartInput } from "../models/dto/CartInput.js";
const { DBOperation } = await import("./dbOperation.js");

export class ShoppingCartRepository extends DBOperation {
  constructor() {
    super();
  }

  async findShoppingCart(userId: number) {
    const queryString =
      "SELECT cart_id, user_id FROM shopping_carts WHERE user_id=$1";
    const values = [userId];
    const result = await this.executeQuery(queryString, values);
    return result.rows.length > 0
      ? (result.rows[0] as ShoppingCartModel)
      : null;
  }

  async createShoppingCart(userId: number) {}

  async findShoppingCartItemById(ShoppingcartId: number) {}

  async findShoppingCartItemByProductId(productId: number) {}

  async findShoppingCartItems(userId: number) {}

  async updateShoppingCartItemById(itemId: number, qty: number) {}

  async updateShoppingCartItemByProductId(productId: string, qty: number) {}

  async deleteShoppingCartItem(id: number) {}
}
