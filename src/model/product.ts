import { Schema } from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema(
  {
    productName: { type: String, required: true },
    description: { type: String, required: true },
    categoryName: { type: String, required: true },
    imgUrl: { type: String, required: true },
    price: { type: Number, required: true },
    datePublish: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("products", productSchema);
