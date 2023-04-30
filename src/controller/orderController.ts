import myCourse from "../model/myCourse";
import Order from "../model/order";
import { Request, Response } from "express";

const getAllOrder = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    const keyword: any = req.query.keyword || "";
    let totalRecord = null;

    const result = await Order.find({
      $or: [{ email: { $regex: keyword } }],
    })
      .skip(size * (page - 1))
      .limit(size);

    if (keyword)
      totalRecord = await Order.count({
        $or: [{ email: { $regex: keyword } }],
      });
    else totalRecord = await Order.count({});

    if (result)
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy tất cả đơn hàng thành công!",
        data: result,
        totalRecord,
      });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getDetailOrder = async (req: Request, res: Response) => {
  try {
    const order_id = req.query.order_id;
    const email = req.query.email;
    const result = await Order.findOne({
      _id: order_id,
      email: email,
    });

    if (result)
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy chi tiết đơn hàng thành công!",
        data: result,
      });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const formatMyCourse = (data: any) => {
  const res = data?.list_course?.map((item: any) => {
    return {
      email: data?.email,
      course_id: item?.course_id,
    };
  });
  return res;
};

const AddOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body;
    const result = await Order.create({
      email: orderData.email,
      list_course: orderData.list_course,
      payment_method: orderData.payment_method,
      is_purchase: false,
    });
    if (result) {
      const listMyCourse = formatMyCourse(orderData);
      await myCourse.create([...listMyCourse]);
      return res.status(200).json({
        errCode: 0,
        errMessage: "Thêm đơn hàng thành công!",
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
      _id: data?.order_id,
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Xóa đơn hàng thành công!",
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
      _id: orderData.order_id,
    });
    if (result) {
      if (orderData.list_course) result.list_course = orderData.list_course;
      if (orderData.payment_method)
        result.payment_method = orderData.payment_method;
      if (orderData.is_purchase) result.is_purchase = orderData.is_purchase;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Cập nhật đơn hàng thành công!",
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
  getDetailOrder,
  AddOrder,
  deleteOrder,
  editOrder,
};
export default orderController;
