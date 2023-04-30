import Course from "../model/course";
import MyCourse from "../model/myCourse";
import { Request, Response } from "express";

const getAllMyCourse = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    const email = req.query.email;
    let totalRecord: number = null;
    const result = await MyCourse.find(
      { email: email },
      { createdAt: 0, updatedAt: 0 }
    )
      .populate("course_id", { createdAt: 0, updatedAt: 0 })
      .skip(size * (page - 1))
      .limit(size);

    totalRecord = await MyCourse.count({ email: email });

    if (result)
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy tất cả khóa học của bạn thành công!",
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

const formatDataToDelete = (data: any) => {
  const res = data?.map((item: any) => {
    return item?.course_id;
  });
  return res;
};

const deleteManyMyCourse = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const listCourse = req.body.list_course;
    const listCourseId = formatDataToDelete(listCourse);
    const result = await MyCourse.deleteMany({
      email,
      course_id: { $in: [...listCourseId] },
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Hủy đăng ký các khóa học thành công!",
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
  deleteManyMyCourse,
  getDetailMyCourse,
};
export default myCourseController;
