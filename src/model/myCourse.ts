import { Schema } from "mongoose";
import mongoose from "mongoose";

const myCourseSchema = new Schema(
  {
    email: { type: String, required: true, ref: "users" },
    course_id: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("myCourses", myCourseSchema);
