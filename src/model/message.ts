import { Schema } from "mongoose";
import mongoose from "mongoose";

const messageSchema = new Schema(
  {
    conversation_id: { type: String, required: true },
    sender: { type: String, required: true, ref: "users" },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("messages", messageSchema);
