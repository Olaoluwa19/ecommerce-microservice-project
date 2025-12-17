import { StringAttribute } from "aws-cdk-lib/aws-cognito";
import mongoose from "mongoose";

type CategoryModel = {
  name: string;
  nameTranslations: string;
  ParentId: string;
  subCategories: CategoryDoc[];
  products: string[];
  displayOrder: number;
  imageUrl: String;
};

export type CategoryDoc = mongoose.Document & CategoryModel;

const CategorySchema = new mongoose.Schema(
  {
    name: String,
    nameTranslations: { en: { type: String }, de: { type: String } },
    parentId: { type: mongoose.SchemaTypes.ObjectId, ref: "categories" },
    subCategories: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "categories",
      },
    ],
    products: [{ type: mongoose.SchemaTypes.ObjectId, ref: "products" }],
    displayOrder: { type: Number, default: 1 },
    imageUrl: { type: String },
  },
  {
    toJSON: {
      transform(doc, ret: { [key: string]: any }, options) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const categories =
  mongoose.models.categories ||
  mongoose.model<CategoryDoc>("categories", CategorySchema);

export { categories };
