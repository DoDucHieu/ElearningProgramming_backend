import Order from "../model/order";
import { Request, Response } from "express";

const getAllOrder = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    const keyword: any = req.query.keyword || "";
    const resultTotal = await Order.find({
      $or: [{ email: { $regex: keyword } }],
    });
    const result = await Order.find({
      $or: [{ email: { $regex: keyword } }],
    })
      .skip(size * (page - 1))
      .limit(size);
    if (result && resultTotal)
      return res.status(200).json({
        errCode: 0,
        errMessage: "Get all order success!",
        data: result,
        totalRecord: resultTotal.length,
      });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const AddOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const result = await Order.create({
      email: orderData.email,
      listProduct: orderData.listProduct,
      shipFee: orderData.shipFee,
      paymentMethod: orderData.paymentMethod ?? false,
      receiveAddress: orderData.receiveAddress,
      isPurchase: false,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Add order success!",
        data: result,
      });
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  try {
    const data = req.query;
    const result = await Order.findOneAndDelete({
      email: data?.email,
      _id: data?.orderId,
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Delete order success!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const editOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const result = await Order.findOne({
      email: orderData.email,
      _id: orderData.orderId,
    });
    if (result) {
      if (orderData.receiveAddress)
        result.receiveAddress = orderData.receiveAddress;
      if (orderData.listProduct) result.listProduct = orderData.listProduct;
      if (orderData.shipFee) result.shipFee = orderData.shipFee;
      if (orderData.paymentMethod)
        result.paymentMethod = orderData.paymentMethod;
      if (orderData.isPurchase) result.isPurchase = orderData.isPurchase;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Edit order success!",
        data: orderData,
      });
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const orderController = {
  getAllOrder,
  AddOrder,
  deleteOrder,
  editOrder,
};
export default orderController;
