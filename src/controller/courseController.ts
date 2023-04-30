import Course from "../model/course";
import { Request, Response } from "express";

const getAllCourse = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    const keyword: any = req.query.keyword || "";
    const sort: any = req.query.sort || "createdAt";
    const filterPrice: any = req.query.filter || undefined;
    let minPrice: number = undefined;
    let maxPrice: number = undefined;

    if (filterPrice) {
      minPrice = JSON.parse(filterPrice)?.minPrice;
      maxPrice = JSON.parse(filterPrice)?.maxPrice;
    }

    console.log("filter: ", minPrice, maxPrice);
    let totalRecord = null;

    const result = await Course.find({
      $or: [{ name: { $regex: keyword } }],
      $and: [
        {
          ...(minPrice !== undefined && {
            price: {
              $gt: minPrice,
            },
          }),
        },
        {
          ...(maxPrice !== undefined && {
            price: {
              $lte: maxPrice,
            },
          }),
        },
      ],
    })
      .sort({ [sort]: -1 })
      .skip(size * (page - 1))
      .limit(size);

    if (keyword || filterPrice)
      totalRecord = await Course.count({
        $or: [{ name: { $regex: keyword } }],
        $and: [
          {
            ...(minPrice !== undefined && {
              price: {
                $gt: minPrice,
              },
            }),
          },
          {
            ...(maxPrice !== undefined && {
              price: {
                $lte: maxPrice,
              },
            }),
          },
        ],
      }).sort({ [sort]: -1 });
    else totalRecord = await Course.count({});

    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy tất cả khóa học thành công!",
        data: result,
        totalRecord,
      });
    } else {
      throw new Error("Khóa học không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getDetailCourse = async (req: Request, res: Response) => {
  try {
    const _id = req.query._id;
    const result = await Course.findById({ _id });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Xem chi tiết khóa học thành công!",
        data: result,
      });
    } else {
      throw new Error("Khóa học không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteCourse = async (req: Request, res: Response) => {
  try {
    const _id = req.query._id;
    const result = await Course.findOneAndDelete({
      _id,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Xóa khóa học thành công!",
      });
    } else {
      throw new Error("Khóa học không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const addCourse = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Course.create({
      name: data.name,
      description: data.description,
      img_url: data.img_url,
      price: data.price,
      number_registry: 0,
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "Đăng khóa học thành công!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const editCourse = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Course.findById({ _id: data._id });
    if (result) {
      result.name = data.name;
      result.description = data.description;
      result.img_url = data.img_url;
      result.price = data.price;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Chỉnh sửa khóa học thành công!",
        data: result,
      });
    } else {
      throw new Error("Khóa học không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const formatListCourseId = (data: any) => {
  const res = data?.map((item: any) => {
    return item?.course_id;
  });
  return res;
};

const increaseRegistryCourse = async (req: Request, res: Response) => {
  try {
    const listCourse = req.body.list_course;
    const listCourseId = formatListCourseId(listCourse);
    const result = await Course.updateMany(
      {
        _id: { $in: [...listCourseId] },
      },
      { $inc: { number_registry: 1 } }
    );
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Tăng số lượt đăng ký khóa học thành công!",
        data: result,
      });
    } else {
      throw new Error("Khóa học không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getAllFreeCourse = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    const keyword: any = req.query.keyword || "";
    const sort: any = req.query.sort || "createdAt";
    const result = await Course.find({
      $or: [{ name: { $regex: keyword } }],
      price: 0,
    })
      .sort({ [sort]: -1 })
      .skip(size * (page - 1))
      .limit(size);

    const totalRecord = await Course.count({
      $or: [{ name: { $regex: keyword } }],
      price: 0,
    })
      .sort({ [sort]: -1 })
      .skip(size * (page - 1))
      .limit(size);

    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy tất cả khóa học miễn phí thành công!",
        data: result,
        totalRecord,
      });
    } else {
      throw new Error("Khóa học không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getAllProCourse = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    const keyword: any = req.query.keyword || "";
    const sort: any = req.query.sort || "createdAt";

    const result = await Course.find({
      $or: [{ name: { $regex: keyword } }],
      $and: [
        {
          price: {
            $gt: 1,
          },
        },
      ],
    })
      .sort({ [sort]: -1 })
      .skip(size * (page - 1))
      .limit(size);

    const totalRecord = await Course.count({
      $or: [{ name: { $regex: keyword } }],
      $and: [
        {
          price: {
            $gt: 1,
          },
        },
      ],
    })
      .sort({ [sort]: -1 })
      .skip(size * (page - 1))
      .limit(size);

    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy tất cả khóa học trả phí thành công!",
        data: result,
        totalRecord,
      });
    } else {
      throw new Error("Khóa học không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const courseController = {
  getAllCourse,
  getDetailCourse,
  addCourse,
  deleteCourse,
  editCourse,
  increaseRegistryCourse,
  getAllFreeCourse,
  getAllProCourse,
};

export default courseController;
