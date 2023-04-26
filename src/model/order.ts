import { Schema } from "mongoose";
import mongoose from "mongoose";

const orderSchema = new Schema(
  {
    email: { type: String, required: true },
    list_course: [
      {
        course_id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    payment_method: { type: Boolean, required: true },
    is_purchase: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("orders", orderSchema);
