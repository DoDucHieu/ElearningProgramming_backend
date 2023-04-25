import { Schema } from "mongoose";
import mongoose from "mongoose";

const cartSchema = new Schema(
  {
    email: { type: String, required: true, ref: "users" },
    productId: { type: String, required: true, ref: "products" },
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("carts", cartSchema);
