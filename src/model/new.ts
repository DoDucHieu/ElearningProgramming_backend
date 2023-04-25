import { Schema } from "mongoose";
import mongoose from "mongoose";

const newSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    contentHTML: { type: String, required: true },
    contentMarkdown: { type: String, required: true },
    author: { type: String, required: true, ref: "users" },
    img_url: { type: String },
    is_approved: { type: Boolean, required: true },
    view: { type: Number },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("news", newSchema);
