import { CategoryInput } from "../dto/category-input";
import { categories, CategoryDoc } from "../models/category-model";
import { products } from "../models/product-models";

export class CategoryRepository {
  cconstructor() {}

  async createCategory({ name, parentId }: CategoryInput) {
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
  }
}
