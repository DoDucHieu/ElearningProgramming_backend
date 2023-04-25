import { Schema } from "mongoose";
import mongoose from "mongoose";

const historySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    accessToken: { type: String },
    refreshToken: { type: String },
    isBlocked: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("accessRights", historySchema);
