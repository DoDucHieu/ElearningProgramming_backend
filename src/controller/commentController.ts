import Comment from "../model/comment";
import New from "../model/new";
import Video from "../model/video";
import Lesson from "../model/lesson";
import User from "../model/user";
import { Request, Response } from "express";

const getAllComment = async (req: Request, res: Response) => {
  try {
    const data = req.query;
    let result = null;
    result = await Comment.find({
      new_id: data._id,
    });
    if (data.type === "new") {
      result = await Comment.find({
        new_id: data._id,
      }).populate("email", { createdAt: 0, updatedAt: 0 });
    } else if (data.type === "video") {
      result = await Comment.find({
        video_id: data._id,
      });
    } else if (data.type === "lesson") {
      result = await Comment.find({
        lesson_id: data._id,
      });
    } else {
      result = await Comment.find({});
    }
    if (result)
      return res.status(200).json({
        errCode: 0,
        errMessage: "Get all comment success!",
        data: result,
      });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const addComment = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const user = await User.findOne({ email: data.email });
    let check = null;
    let new_id = null;
    let video_id = null;
    let lesson_id = null;
    if (data.type === "new") {
      check = await New.findOne({ new_id: data._id });
      if (check) new_id = data._id;
    }
    if (data.type === "video") {
      check = await Video.findOne({ video_id: data._id });
      if (check) video_id = data._id;
    }
    if (data.type === "lesson") {
      check = await Lesson.findOne({ lesson_id: data._id });
      if (check) lesson_id = data._id;
    }
    if (user && check) {
      const result = await Comment.create({
        email: data.email,
        type: data.type,
        new_id,
        video_id,
        lesson_id,
        comment: data.comment,
      });
      return res.status(200).json({
        errCode: 0,
        errMessage: "Add comment success!",
        data: result,
      });
    } else {
      return res.status(200).json({
        errCode: 1,
        errMessage: "User or product not found!",
      });
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const editComment = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    let result = await Comment.findOne({
      email: data.email,
      new_id: data.new_id ?? null,
      video_id: data.video_id ?? null,
      lesson_id: data.lesson_id ?? null,
      _id: data.commentId,
    });
    if (result) {
      result.comment = data.comment;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Update comment success!",
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

const deleteComment = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Comment.findOneAndDelete({
      email: data.email,
      new_id: data.new_id ?? null,
      video_id: data.video_id ?? null,
      lesson_id: data.lesson_id ?? null,
      _id: data.commentId,
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Delete comment success!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const commentController = {
  getAllComment,
  addComment,
  editComment,
  deleteComment,
};
export default commentController;
