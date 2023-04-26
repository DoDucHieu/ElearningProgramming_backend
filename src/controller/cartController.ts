import Cart from "../model/cart";
import { Request, Response } from "express";

const getAllCartByEmail = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    const result = await Cart.find(
      { email: email },
      { createdAt: 0, updatedAt: 0, userName: 0 }
    ).populate("course_id", { createdAt: 0, updatedAt: 0 });
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
      course_id: cartData.course_id,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Khóa học này đã có trong giỏ hàng!",
        data: result,
      });
    } else {
      const rs = await Cart.create({
        email: cartData.email,
        course_id: cartData.course_id,
      });
      return res.status(200).json({
        errCode: 0,
        errMessage: "Thêm vào giỏ hàng thành công!",
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
      course_id: cartData.course_id,
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Đã xóa khóa học khỏi giỏ hàng!",
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
      errMessage: "Đã xóa tất cả khóa học trong giỏ hàng!",
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
