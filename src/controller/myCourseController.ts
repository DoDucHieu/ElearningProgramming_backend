import Course from "../model/course";
import MyCourse from "../model/myCourse";
import { Request, Response } from "express";

const getAllMyCourse = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    const result = await MyCourse.find(
      { email: email },
      { createdAt: 0, updatedAt: 0, userName: 0 }
    );
    return res.status(200).json({
      errCode: 0,
      errMessage: "Lấy tất cả khóa học của bạn thành công!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const registryCourse = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const course_id = req.body.course_id;
    const check = await MyCourse.findOne({
      email,
      course_id,
    });
    if (!check) {
      const course = await Course.findOne({ _id: course_id });
      if (course?.price === 0) {
        const result = await MyCourse.create({
          email,
          course_id,
        });
        if (result) course.number_registry += 1;
        await course.save();
        return res.status(200).json({
          errCode: 0,
          errMessage: "Đăng ký khóa học thành công!",
          data: result,
        });
      } else {
        throw new Error("Bạn phải mua khóa học này!");
      }
    } else {
      throw new Error("Bạn đã đăng ký khóa học này rồi");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteMyCourse = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    const course_id = req.query.course_id;
    const result = await MyCourse.findOneAndDelete({
      email,
      course_id,
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Hủy đăng ký khóa học thành công!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteAllMyCourse = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    const result = await MyCourse.deleteMany({
      email,
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Hủy đăn ký tất cả khóa học thành công!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getDetailMyCourse = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    const course_id = req.query.course_id;
    const result = await MyCourse.findOne({
      email,
      course_id,
    });
    if (result)
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy chi tiết khóa học của bạn thành công!",
        data: result,
      });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const myCourseController = {
  getAllMyCourse,
  registryCourse,
  deleteMyCourse,
  deleteAllMyCourse,
  getDetailMyCourse,
};
export default myCourseController;
