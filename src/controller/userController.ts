import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user";
import { Request, Response } from "express";

const getAllUser = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    const keyword: any = req.query.keyword || "";
    let totalRecord = null;

    const result = await User.find({
      $or: [{ email: { $regex: keyword } }],
    })
      .skip(size * (page - 1))
      .limit(size);

    if (keyword)
      totalRecord = await User.count({
        $or: [{ email: { $regex: keyword } }],
      });
    else totalRecord = await User.count({});
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Get all user success!",
        data: result,
        totalRecord,
      });
    } else {
      throw new Error("There are no user!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getDetailUser = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    const result = await User.findOne(
      {
        email,
      },
      { password: 0, is_blocked: 0 }
    );
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Get detail user success!",
        data: result,
      });
    } else {
      throw new Error("There is no user!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getDetailUserById = async (req: Request, res: Response) => {
  try {
    const user_id = req.query.user_id;
    const result = await User.findOne(
      {
        _id: user_id,
      },
      { password: 0, is_blocked: 0 }
    );
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Lấy thông tin chi tiết người dùng thành công!",
        data: result,
      });
    } else {
      throw new Error("Người dùng không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const addUser = async (req: Request, res: Response) => {
  try {
    let userData = req.body;
    const checkExist = await User.findOne({ email: userData.email });
    if (checkExist) {
      throw new Error("This email is already exists!");
    } else {
      const salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hash(userData.password, salt);
      const result = await User.create({
        email: userData.email,
        password: hashPassword,
        role: userData.role,
        address: userData.address,
        fullName: userData.fullName,
      });
      if (result) {
        return res.status(200).json({
          errCode: 0,
          errMessage: "Thêm người dùng thành công!",
          userInfor: result,
        });
      }
    }
  } catch (e) {
    return res.status(200).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const editUser = async (req: Request, res: Response) => {
  try {
    let userData = req.body;
    const user = await User.findOne({ email: userData.email });
    if (user) {
      if (userData.role) user.role = userData.role;
      if (userData.fullName) user.fullName = userData.fullName;
      if (userData.address) user.address = userData.address;
      if (userData.avatar) user.avatar = userData.avatar;
      await user.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Cập nhật người dùng thành công!",
        data: user,
      });
    } else {
      throw new Error("Người dùng không tồn tại!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    let id = req.query.id;
    const user = await User.deleteOne({ _id: id });
    if (user)
      return res.status(200).json({ message: `Xóa người dùng thành công!` });
    else throw new Error("Người dùng không tồn tại!");
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const blockUser = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const is_blocked = req.body.isBlock;
    console.log("req: ", is_blocked);

    const user = await User.findOne({ email: email });
    if (user) {
      if (user.role !== "admin") {
        user.is_blocked = is_blocked;
        await user.save();
        return res.status(200).json({
          errCode: 0,
          message: is_blocked
            ? "Chặn người dùng thành công!"
            : "Bỏ chặn người dùng thành công!",
        });
      } else {
        return res.status(500).json({
          errorCode: 1,
          message: "Bạn không thể chặn tài khoản admin!",
        });
      }
    } else throw new Error("Người dùng không tồn tại!");
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const userController = {
  getAllUser,
  getDetailUser,
  getDetailUserById,
  addUser,
  editUser,
  deleteUser,
  blockUser,
};

export default userController;
