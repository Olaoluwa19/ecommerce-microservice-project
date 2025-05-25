import mongoose from "mongoose";
const Schema = mongoose.Schema;
import addressSchema from "./Address.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    roles: {
      type: [
        {
          type: Number,
          enum: [2314, 6573, 8926],
        },
      ],
      default: [2000],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    customerIsBanned: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    refreshToken: String,
    address: [addressSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
