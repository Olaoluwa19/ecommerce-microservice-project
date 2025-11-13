import { ProductInput } from "../dto/product-input";
import { products } from "../models/product-models";

export class ProductRepository {
  constructor() {}

  async createProduct({
    name,
    description,
    price,
    category_id,
    image_url,
  }: ProductInput) {
    return products.create({
      name,
      description,
      price,
      category_id,
      image_url,
      availability: true,
    });
  }

  async getAllProducts(offset = 0, pages?: number) {}

  async getProductById(id: string) {}

  // async updateProduct({ name, description, price, category_id, image_url }) {}

  async deleteProduct(id: string) {}
}
