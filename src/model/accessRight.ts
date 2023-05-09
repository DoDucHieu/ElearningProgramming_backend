import { Schema } from "mongoose";
import mongoose from "mongoose";

const accessRightSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    accessToken: { type: String },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("accessRights", accessRightSchema);
