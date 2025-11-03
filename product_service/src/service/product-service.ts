import { ProductRepository } from "../repository/product-repository";
import { SuccessResponse } from "../utility/response";

export class ProductService {
  _repository: ProductRepository;
  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async createProduct() {
    return SuccessResponse({ msg: "Product Created!" });
  }

  async getProducts() {
    return SuccessResponse({ msg: "get Products" });
  }

  async getProduct() {
    return SuccessResponse({ msg: "get Product by id" });
  }

  async editProduct() {
    return SuccessResponse({ msg: "edit Product" });
  }

  async deleteProduct() {
    return SuccessResponse({ msg: "delete Product" });
  }
}
