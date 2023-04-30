import Message from "../model/message";
import { Request, Response } from "express";

const getAllMessage = async (req: Request, res: Response) => {
  try {
    const conversation_id = req.query.conversation_id;
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    const keyword: any = req.query.keyword || "";

    let totalRecord = null;
    const result = await Message.find({
      $or: [{ text: { $regex: keyword } }],
      conversation_id,
    })
      .skip(size * (page - 1))
      .limit(size);

    if (keyword)
      totalRecord = await Message.count({
        $or: [{ text: { $regex: keyword } }],
        conversation_id,
      });
    else totalRecord = await Message.count({});

    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy tất cả tin nhắn thành công!",
        data: result,
        totalRecord,
      });
    } else {
      throw new Error("Tin nhắn này không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteMessage = async (req: Request, res: Response) => {
  try {
    const _id = req.query._id;
    const result = await Message.findOneAndDelete({
      _id,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Xóa tin nhắn thành công!",
      });
    } else {
      throw new Error("Tin nhắn không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const addMessage = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Message.create({
      conversation_id: data.conversation_id,
      sender: data.sender_id,
      text: data.text,
    });

    if (result)
      return res.status(200).json({
        errCode: 0,
        errMessage: "Gửi tin nhắn thành công!",
        data: result,
      });
    else {
      throw new Error("Gửi tin nhắn thất bại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const messageController = {
  getAllMessage,
  addMessage,
  deleteMessage,
};

export default messageController;
