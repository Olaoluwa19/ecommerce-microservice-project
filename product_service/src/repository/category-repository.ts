import { AddItemInput, CategoryInput } from "../dto/category-input";
import { categories, CategoryDoc } from "../models";
import { BadRequest, InternalError, NotFound } from "../utility/response";

export class CategoryRepository {
  cconstructor() {}

  async createCategory({ name, parentId, imageUrl }: CategoryInput) {
    try {
      const newCategory = await categories.create({
        name,
        parentId,
        subcategory: [],
        products: [],
        imageUrl,
      });
      if (parentId) {
        const parentCategory = (await categories.findById(
          parentId
        )) as CategoryDoc;
        parentCategory.subCategories = [
          ...parentCategory.subCategories,
          newCategory._id,
        ];
        await parentCategory.save();
      }
      return newCategory;
    } catch (error) {
      return InternalError(error);
    }
  }

  async getAllCategories(offset = 0, perPage?: number) {
    try {
      return categories
        .find({ parentId: null })
        .populate({
          path: "subCategories",
          model: "categories",
          populate: {
            path: "subCategories",
            model: "categories",
          },
        })
        .skip(offset)
        .limit(perPage ? perPage : 100);
    } catch (error) {
      return InternalError(error);
    }
  }

  async getTopCategories() {
    try {
      return categories
        .find({ parentId: { $ne: null } }, { products: { $slice: 10 } })
        .populate({
          path: "products",
          model: "products",
        })
        .sort({ displayOrder: "descending" })
        .limit(10);
    } catch (error) {
      return InternalError(error);
    }
  }

  async getCategoryById(id: string, offset = 0, perPage?: number) {
    try {
      return categories
        .findById(id, {
          products: { $slice: [offset, perPage ? perPage : 100] },
        })
        .populate({
          path: "products",
          model: "products",
        });
    } catch (error) {
      console.log(error);
      return InternalError(error);
    }
  }

  async updateCategory({ id, name, displayOrder, imageUrl }: CategoryInput) {
    try {
      if (!id) {
        return BadRequest("Category ID is required");
      }
      let category = (await categories.findById(id)) as CategoryDoc;
      if (!category) {
        return NotFound("Category not found");
      }
      category.name = name || category.name;
      category.displayOrder = displayOrder || category.displayOrder;
      category.imageUrl = imageUrl || category.imageUrl;
      await category.save();
      return category;
    } catch (error) {
      console.log(error);
      return InternalError(error);
    }
  }

  async deleteCategory(id: string) {
    try {
      return await categories.deleteOne({ _id: id });
    } catch (error) {
      console.log(error);
      return InternalError(error);
    }
  }

  async addItem({ id, products }: AddItemInput) {
    try {
      let category = (await categories.findById(id)) as CategoryDoc;
      if (!category) {
        return NotFound("Category not found");
      }
      category.products = [...category.products, ...products];
      await category.save();
      return category;
    } catch (error) {
      console.log(error);
      return InternalError(error);
    }
  }

  async removeItem({ id, products }: AddItemInput) {
    try {
      let category = (await categories.findById(id)) as CategoryDoc;
      if (!category) {
        return NotFound("Category not found");
      }
      const excludeProducts = category.products.filter(
        (item) => !products.includes(item)
      );
      category.products = excludeProducts;
      await category.save();
      return category;
    } catch (error) {
      console.log(error);
      return InternalError(error);
    }
  }
}
