import { Schema } from "mongoose";
import mongoose from "mongoose";

const assessmentSchema = new Schema(
  {
    userName: { type: String, required: true, ref: "users" },
    productId: { type: Schema.Types.ObjectId, required: true, ref: "products" },
    star: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("assessments", assessmentSchema);
