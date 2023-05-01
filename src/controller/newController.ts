import New from "../model/new";
import { Request, Response } from "express";

const getAllNew = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    const keyword: any = req.query.keyword || "";
    let totalRecord = null;

    const result = await New.find({ $or: [{ name: { $regex: keyword } }] })
      .populate("author", { createdAt: 0, updatedAt: 0 })
      .skip(size * (page - 1))
      .limit(size);

    if (keyword)
      totalRecord = await New.count({
        $or: [{ name: { $regex: keyword } }],
      });
    else totalRecord = await New.count({});

    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy tất cả bài đăng thành công!",
        data: result,
        totalRecord,
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

const getDetailNew = async (req: Request, res: Response) => {
  try {
    const _id = req.query._id;
    const result = await New.findById({ _id }).populate("author", {
      createdAt: 0,
      updatedAt: 0,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Xem chi tiết bài đăng thành công!",
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

const deleteNew = async (req: Request, res: Response) => {
  try {
    const _id = req.query._id;
    const result = await New.findOneAndDelete({
      _id,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Xóa bài đăng thành công!",
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

const addNew = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await New.create({
      name: data.name,
      description: data.description,
      contentMarkdown: data.contentMarkdown,
      contentHTML: data.contentHTML,
      img_url: data.img_url,
      author: data.author,
      is_approved: false,
      view: 0,
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "Đăng bài thành công, đang chờ duyệt!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const editNew = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await New.findById({ _id: data._id });
    if (result) {
      result.name = data.name;
      result.description = data.description;
      result.contentMarkdown = data.contentMarkdown;
      result.contentHTML = data.contentHTML;
      result.author = data.author;
      result.img_url = data.img_url;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Chỉnh sửa bài đăng thành công!",
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

const approveNew = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await New.findById({ _id: data._id });
    if (result) {
      result.is_approved = true;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Phê duyệt bài đăng thành công!",
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

const increaseView = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await New.findById({ _id: data._id });
    if (result && result.is_approved) {
      result.view += 1;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Tăng view thành công!",
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

const newController = {
  getAllNew,
  getDetailNew,
  addNew,
  deleteNew,
  editNew,
  approveNew,
  increaseView,
};

export default newController;
