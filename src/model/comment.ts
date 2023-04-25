import { Schema } from "mongoose";
import mongoose from "mongoose";

const commentSchema = new Schema(
  {
    email: { type: String, required: true, ref: "users" },
    comment: { type: String, required: true },
    type: { type: String, required: true },
    video_id: { type: String },
    new_id: { type: String },
    lesson_id: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("comments", commentSchema);
