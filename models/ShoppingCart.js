import mongoose, { Schema } from "mongoose";

const shoppingCartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cartItems: [
    {
      type: Schema.Types.ObjectId,
      ref: "CartItem",
    },
  ],
});

export default mongoose.model("ShoppingCart", shoppingCartSchema);
