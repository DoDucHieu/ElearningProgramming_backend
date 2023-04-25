import { Schema } from "mongoose";
import mongoose from "mongoose";

const lessonSchema = new Schema(
  {
    course_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    img_url: { type: String, required: true },
    type: { type: String, required: Boolean },
    video_url: { type: String, required: true },
    postHTML: { type: String, required: true },
    postMarkdown: { type: String, required: true },
    author: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("lessons", lessonSchema);
