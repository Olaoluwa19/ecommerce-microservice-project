export class ProductRepository {
  constructor() {}

  async createProduct({ name, description, price, category_id, image_url }) {}

  async getAllProducts(offset = 0, pages?: number) {}

  async getProductById(id: string) {}

  async updateProduct({ name, description, price, category_id, image_url }) {}

  async deleteProduct(id: string) {}
}
