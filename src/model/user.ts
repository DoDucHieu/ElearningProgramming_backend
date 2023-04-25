import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String },
    fullName: { type: String },
    address: { type: String },
    avatar: { type: String },
    is_blocked: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("users", userSchema);
