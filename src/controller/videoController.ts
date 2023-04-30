import Video from "../model/video";
import { Request, Response } from "express";

const getAllVideo = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    const keyword: any = req.query.keyword || "";
    let totalRecord = null;
    const result = await Video.find({ $or: [{ name: { $regex: keyword } }] })
      .skip(size * (page - 1))
      .limit(size);

    if (keyword)
      totalRecord = await Video.count({
        $or: [{ name: { $regex: keyword } }],
      });
    else totalRecord = await Video.count({});

    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy tất cả video thành công!",
        data: result,
        totalRecord,
      });
    } else {
      throw new Error("Video không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getDetailVideo = async (req: Request, res: Response) => {
  try {
    const _id = req.query._id;
    const result = await Video.findById({ _id });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Xem chi tiết video thành công!",
        data: result,
      });
    } else {
      throw new Error("Video không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteVideo = async (req: Request, res: Response) => {
  try {
    const _id = req.query._id;
    const result = await Video.findOneAndDelete({
      _id,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Xóa video thành công!",
      });
    } else {
      throw new Error("Video không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const addVideo = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Video.create({
      name: data.name,
      description: data.description,
      img_url: data.img_url,
      video_url: data.video_url,
      author: data.author,
      is_approved: false,
      view: 0,
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "Đăng video thành công, đang chờ duyệt!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const editVideo = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Video.findById({ _id: data._id });
    if (result) {
      result.name = data.name;
      result.description = data.description;
      result.author = data.author;
      result.img_url = data.img_url;
      result.video_url = data.video_url;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Chỉnh sửa video thành công!",
        data: result,
      });
    } else {
      throw new Error("Video không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const approveVideo = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Video.findById({ _id: data._id });
    if (result) {
      result.is_approved = true;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Phê duyệt video thành công!",
        data: result,
      });
    } else {
      throw new Error("Video không tồn tại!");
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
    const result = await Video.findById({ _id: data._id });
    if (result && result.is_approved) {
      result.view += 1;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Tăng view thành công!",
        data: result,
      });
    } else {
      throw new Error("Video không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const videoController = {
  getAllVideo,
  getDetailVideo,
  addVideo,
  deleteVideo,
  editVideo,
  approveVideo,
  increaseView,
};

export default videoController;
