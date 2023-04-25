import { Schema } from "mongoose";
import mongoose from "mongoose";

const orderSchema = new Schema(
  {
    email: { type: String, required: true },
    listProduct: [
      {
        productId: { type: String, required: true },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    shipFee: { type: Number },
    paymentMethod: { type: Boolean, required: true },
    receiveAddress: { type: String, required: true },
    isPurchase: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("orders", orderSchema);
