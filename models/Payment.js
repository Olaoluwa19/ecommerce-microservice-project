import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    paymentMethod: {
      type: String,
      enum: ["creditCard", "paypal", "bankTransfer"],
      required: true,
    },
    paymentGateway: {
      type: String,
      enum: ["stripe", "paypal", "bank"],
      required: true,
    },
    cardNumber: {
      type: String,
      required: function () {
        return this.paymentMethod === "creditCard";
      },
    },
    expirationDate: {
      type: Date,
      required: function () {
        return this.paymentMethod === "creditCard";
      },
    },
    cvv: {
      type: String,
      required: function () {
        return this.paymentMethod === "creditCard";
      },
    },
    billingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["USD", "EUR", "GBP"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "successful", "failed"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    transactionId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);
