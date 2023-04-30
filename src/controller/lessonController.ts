import Lesson from "../model/lesson";
import { Request, Response } from "express";

const getAllLesson = async (req: Request, res: Response) => {
  try {
    const course_id: any = req.query.course_id;
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    const keyword: any = req.query.keyword || "";
    let totalRecord = null;

    const result = await Lesson.find({
      $or: [{ name: { $regex: keyword } }],
      course_id,
    })
      .skip(size * (page - 1))
      .limit(size);

    if (keyword)
      totalRecord = await Lesson.count({
        $or: [{ name: { $regex: keyword } }],
        course_id,
      });
    else totalRecord = await Lesson.count({});

    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy tất cả bài học thành công!",
        data: result,
        totalRecord,
      });
    } else {
      throw new Error("Bài học không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getDetailLesson = async (req: Request, res: Response) => {
  try {
    const _id = req.query._id;
    const result = await Lesson.findById({ _id });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Xem chi tiết bài học thành công!",
        data: result,
      });
    } else {
      throw new Error("Bài học không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteLesson = async (req: Request, res: Response) => {
  try {
    const _id = req.query._id;
    const result = await Lesson.findOneAndDelete({
      _id,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Xóa bài học thành công!",
      });
    } else {
      throw new Error("Bài học không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const addLesson = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Lesson.create({
      course_id: data.course_id,
      name: data.name,
      description: data.description,
      type: data.type,
      video_url: data.video_url,
      contentHTML: data.contentHTML,
      contentMarkdown: data.contentMarkdown,
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "Đăng bài học thành công!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const editLesson = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Lesson.findById({ _id: data._id });
    if (result) {
      result.name = data.name;
      result.description = data.description;
      result.type = data.type;
      result.video_url = data.video_url;
      result.contentHTML = data.contentHTML;
      result.contentMarkdown = data.contentMarkdown;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Chỉnh sửa bài học thành công!",
        data: result,
      });
    } else {
      throw new Error("Bài học không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const lessonController = {
  getAllLesson,
  getDetailLesson,
  addLesson,
  deleteLesson,
  editLesson,
};

export default lessonController;
