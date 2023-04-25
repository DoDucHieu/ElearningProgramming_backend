import Cart from "../model/cart";
import { Request, Response } from "express";

const getAllCartByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    const result = await Cart.find(
      { email: email },
      { createdAt: 0, updatedAt: 0, userName: 0 }
    ).populate("productId", { createdAt: 0, updatedAt: 0 });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Get all cart success!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const AddOrUpdateCart = async (req: Request, res: Response) => {
  try {
    const cartData = req.body;
    const result = await Cart.findOne({
      email: cartData.email,
      productId: cartData.productId,
    });
    if (result) {
      result.quantity = Number(result.quantity) + Number(cartData.quantity);
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Update cart success!",
        data: result,
      });
    } else {
      const rs = await Cart.create({
        email: cartData.email,
        productId: cartData.productId,
        quantity: cartData.quantity,
      });
      return res.status(200).json({
        errCode: 0,
        errMessage: "Add to cart success!",
        data: rs,
      });
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const removeFromCart = async (req: Request, res: Response) => {
  try {
    const cartData = req.query;
    const result = await Cart.findOneAndDelete({
      email: cartData.email,
      productId: cartData.productId,
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Delete from cart success!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteAllCartByEmail = async (req: Request, res: Response) => {
  try {
    const cartData = req.query;
    const result = await Cart.deleteMany({
      email: cartData.email,
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Delete all cart success!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const cartController = {
  getAllCartByEmail,
  AddOrUpdateCart,
  removeFromCart,
  deleteAllCartByEmail,
};
export default cartController;
