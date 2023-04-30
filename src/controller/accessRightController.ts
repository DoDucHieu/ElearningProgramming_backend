import AccessRight from "../model/accessRight";
import { Request, Response } from "express";

const getAllAccessRight = async (req: Request, res: Response) => {
  try {
    const result = await AccessRight.find({});
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Get all access right success!",
        listAccessRight: result,
      });
    } else {
      throw new Error("There are no access right!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getDetailAccessRight = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const result = await AccessRight.findById({ _id: id });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Get detail access right success!",
        accessRight: result,
      });
    } else {
      throw new Error("There are no accessRight!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteAccessRight = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const result = await AccessRight.findOneAndDelete({
      _id: id,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Delete access right success!",
      });
    } else {
      throw new Error("This access right is already deleted!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const createAccessRight = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await AccessRight.create({
      userId: data.userId,
      loginTime: data.loginTime,
      isBlocked: false,
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "Create new access right success!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const updateAccessRight = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await AccessRight.findById({ _id: data.id });
    if (result) {
      result.isBlocked = data.isBlocked;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Update access right success!",
        data: result,
      });
    } else {
      throw new Error("This access right does't exist!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const accessRightController = {
  getAllAccessRight,
  getDetailAccessRight,
  createAccessRight,
  deleteAccessRight,
  updateAccessRight,
};

export default accessRightController;
