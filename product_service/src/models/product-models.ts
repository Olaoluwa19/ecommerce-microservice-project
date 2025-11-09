import mongoose from "mongoose";

type ProductModel = {
  name: string;
  description: string;
  ctategory_id: string;
  image_url: string;
  price: number;
  availability: boolean;
};

export type ProductDoc = mongoose.Document & ProductModel;

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    ctategory_id: String,
    image_url: String,
    price: Number,
    availability: Boolean,
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

const products =
  mongoose.models.products ||
  mongoose.model<ProductDoc>("products", ProductSchema);

export { products };
