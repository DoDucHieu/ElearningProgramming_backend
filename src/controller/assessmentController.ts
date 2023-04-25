import Book from "../model/product";
import Assessment from "../model/assessment";
import User from "../model/user";
import { Request, Response } from "express";

const getAllAssessmentByProductId = async (req: Request, res: Response) => {
  try {
    const data = req.query;
    const result = await Assessment.find({
      productId: data.productId,
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Get all assessment success!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const addAssessment = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const user = await User.findOne({ userName: data.userName });
    const book = await Book.findOne({ productId: data.productId });
    if (user && book) {
      const result = await Assessment.create({
        userName: data.userName,
        productId: data.productId,
        star: data.star,
      });
      return res.status(200).json({
        errCode: 0,
        errMessage: "Add assessment success!",
        data: result,
      });
    } else {
      return res.status(200).json({
        errCode: 1,
        errMessage: "User or book not found!",
      });
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const updateAssessment = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Assessment.findOne({
      userName: data.userName,
      productId: data.productId,
      _id: data.assessmentId,
    });
    if (result) {
      result.star = data.newStar;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Update assessment success!",
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

const deleteAssessment = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Assessment.findOneAndDelete({
      userName: data.userName,
      productId: data.productId,
      _id: data.assessmentId,
    });
    return res.status(200).json({
      errCode: 0,
      errMessage: "Delete assessment success!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const assessmentController = {
  getAllAssessmentByProductId,
  addAssessment,
  updateAssessment,
  deleteAssessment,
};
export default assessmentController;
