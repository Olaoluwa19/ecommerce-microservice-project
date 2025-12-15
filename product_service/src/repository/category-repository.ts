import { CategoryInput } from "../dto/category-input";
import { categories, CategoryDoc } from "../models/category-model";
import { InternalError, NotFound } from "../utility/response";

export class CategoryRepository {
  cconstructor() {}

  async createCategory({ name, parentId }: CategoryInput) {
    try {
      // create a new category
      const newCategory = await categories.create({
        name,
        parentId,
        subcategory: [],
        products: [],
      });
      // check parent id exists
      // update parent category with the new category as child
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
      // return the created category
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
      return InternalError(error);
    }
  }

  async updateCategory({ id, name, displayOrder }: CategoryInput) {
    try {
      let category = (await categories.findById(id)) as CategoryDoc;
      if (!category) {
        return NotFound("Category not found");
      }
      category.name = name || category.name;
      category.displayOrder = displayOrder || category.displayOrder;
      await category.save();
      return category;
    } catch (error) {
      return InternalError(error);
    }
  }

  async deleteCategory(id: string) {
    try {
      return await categories.deleteOne({ _id: id });
    } catch (error) {
      return InternalError(error);
    }
  }
}
