import { Schema } from "mongoose";
import mongoose from "mongoose";

const videoSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    img_url: { type: String, required: true },
    video_url: { type: String, required: true },
    is_approved: { type: Boolean, required: true },
    view: { type: Number },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("videos", videoSchema);
