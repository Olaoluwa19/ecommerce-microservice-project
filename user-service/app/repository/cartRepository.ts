import {
  BadRequest,
  CreatedResponse,
  InternalError,
} from "app/utility/response.js";
import { AddressModel } from "../models/AddressModel.js";
import { CartModel } from "../models/CartModel.js";
import { CartInput } from "../models/dto/CartInput.js";
const { DBOperation } = await import("./dbOperation.js");

export class CartRepository extends DBOperation {
  constructor() {
    super();
  }

  async findCart(userId: number) {}

  async createCart(userId: number) {}

  async findCartItemById(cartId: number) {}

  async findCartItemByProductId(productId: number) {}

  async findCartItems(userId: number) {}

  async updateCartItemById(itemId: number, qty: number) {}

  async updateCartItemByProductId(productId: string, qty: number) {}

  async deleteCartItem(id: number) {}
}
