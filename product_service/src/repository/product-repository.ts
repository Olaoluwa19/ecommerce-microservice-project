import { ProductInput } from "../dto/product-input";
import { ProductDoc, products } from "../models";
import { BadRequest, InternalError, NotFound } from "../utility/response";

export class ProductRepository {
  constructor() {}

  async createProduct({
    name,
    description,
    price,
    category_id,
    image_url,
  }: ProductInput): Promise<ProductDoc> {
    try {
      return await products.create({
        name,
        description,
        price,
        category_id,
        image_url,
        availability: true,
      });
    } catch (error) {
      throw InternalError(error);
    }
  }

  async getAllProducts(offset = 0, pages?: number) {
    try {
      return products
        .find()
        .skip(offset)
        .limit(pages ? pages : 500);
    } catch (error) {
      return InternalError(error);
    }
  }

  async getProductById(id: string) {
    try {
      if (!id) {
        return BadRequest("Product ID is required");
      }
      return products.findById(id);
    } catch (error) {
      return InternalError(error);
    }
  }

  async updateProduct({
    id,
    name,
    description,
    price,
    category_id,
    image_url,
    availability,
  }: ProductInput) {
    try {
      if (!id) {
        return BadRequest("Product ID is required");
      }
      let existingProduct = (await products.findById(id)) as ProductDoc;
      if (!existingProduct) {
        return NotFound("Product not found");
      }
      existingProduct.name = name;
      existingProduct.description = description;
      existingProduct.price = price;
      existingProduct.category_id = category_id;
      existingProduct.image_url = image_url;
      existingProduct.availability = availability;

      return existingProduct.save();
    } catch (error) {
      return InternalError(error);
    }
  }

  async deleteProduct(id: string) {
    try {
      if (!id) {
        return BadRequest("Product ID is required");
      }
      const { category_id } = (await products.findById(id)) as ProductDoc;
      if (!category_id) {
        return NotFound("Category not found");
      }

      const product = await products.findById(id);
      if (!product) {
        return NotFound("Product not found");
      }
      const deleteResult = await products.deleteOne({ _id: product._id });

      return { deleteResult, category_id };
    } catch (error) {
      return InternalError(error);
    }
  }
}
