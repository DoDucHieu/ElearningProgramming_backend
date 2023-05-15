import Conversation from "../model/conversation";
import { Request, Response } from "express";

const getAllConversation = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    let totalRecord = null;

    const result = await Conversation.find({
      members: { $in: [req.query.user_id] },
    })
      .sort({ createdAt: -1 })
      .skip(size * (page - 1))
      .limit(size);

    totalRecord = await Conversation.count({});

    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy tất cả cuộc trò chuyện thành công!",
        data: result,
        totalRecord,
      });
    } else {
      throw new Error("Cuộc trò chuyện này không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getDetailConversation = async (req: Request, res: Response) => {
  try {
    const _id = req.query._id;
    const result = await Conversation.findById({ _id });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Xem chi tiết đoạn hội thoại thành công!",
        data: result,
      });
    } else {
      throw new Error("Bài đăng không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteConversation = async (req: Request, res: Response) => {
  try {
    const _id = req.query._id;
    const result = await Conversation.findOneAndDelete({
      _id,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Xóa đoạn hội thoại thành công!",
      });
    } else {
      throw new Error("Đoạn hội thoại không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const addConversation = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    console.log("member: ", data);

    const check = await Conversation.find({
      members: { $all: [data.sender_id, data.receiver_id] },
    });
    if (check.length > 0) {
      console.log("check : ", check);

      return res.status(200).json({
        errCode: 1,
        errMessage: "Cuộc hội thoại này đã tồn tại",
        result: check,
      });
    } else {
      const result = await Conversation.create({
        members: [data.sender_id, data.receiver_id],
      });
      if (result)
        return res.status(200).json({
          errCode: 0,
          errMessage: "Thêm đoạn hội thoại thành công!",
          result,
        });
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const editConversation = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Conversation.findById({
      _id: data.conversation_id,
    });
    if (result) {
      result.name = data.name;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Sửa đoạn hội thoại thành công!",
        data: result,
      });
    } else {
      throw new Error("Đoạn hội thoại này không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const conversationController = {
  getAllConversation,
  getDetailConversation,
  addConversation,
  editConversation,
  deleteConversation,
};

export default conversationController;
