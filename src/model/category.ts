import { Schema } from "mongoose";
import mongoose from "mongoose";

const categorySchema = new Schema(
  {
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("categories", categorySchema);
