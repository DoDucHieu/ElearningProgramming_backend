import { Schema } from "mongoose";
import mongoose from "mongoose";

const conversationSchema = new Schema(
  {
    members: { type: Array, required: true },
    name: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("conversations", conversationSchema);
