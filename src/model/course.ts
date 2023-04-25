import { Schema } from "mongoose";
import mongoose from "mongoose";

const courseSchema = new Schema(
  {
    course_name: { type: String, required: true },
    description: { type: String, required: true },
    img_url: { type: String, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("courses", courseSchema);
