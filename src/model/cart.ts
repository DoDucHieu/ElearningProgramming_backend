import { Schema } from "mongoose";
import mongoose from "mongoose";

const cartSchema = new Schema(
  {
    email: { type: String, required: true, ref: "users" },
    course_id: { type: String, required: true, ref: "courses" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("carts", cartSchema);
