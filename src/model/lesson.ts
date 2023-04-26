import { Schema } from "mongoose";
import mongoose from "mongoose";

const lessonSchema = new Schema(
  {
    course_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: Boolean, required: true },
    video_url: { type: String },
    contentHTML: { type: String },
    contentMarkdown: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("lessons", lessonSchema);
