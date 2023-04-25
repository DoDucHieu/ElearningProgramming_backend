import Category from "../model/category";
import { Request, Response } from "express";

const getAllCategory = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page) || 1;
    const size: number = Number(req.query.size) || 10;
    const keyword: any = req.query.keyword || "";
    const resultTotal = await Category.find({
      $or: [{ categoryName: { $regex: keyword } }],
    });
    const result = await Category.find({
      $or: [{ categoryName: { $regex: keyword } }],
    })
      .skip(size * (page - 1))
      .limit(size);
    if (result && resultTotal) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Get all category success!",
        listCategory: result,
        totalRecord: resultTotal.length,
      });
    } else {
      throw new Error("There are no category!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getDetailCategory = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const result = await Category.findById({ _id: id });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Get detail category success!",
        category: result,
      });
    } else {
      throw new Error("There are no category!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const result = await Category.findOneAndDelete({
      _id: id,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Delete category success!",
      });
    } else {
      throw new Error("This category is already deleted!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const createCategory = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Category.create({
      categoryId: data.categoryId,
      categoryName: data.categoryName,
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "Create new category success!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const updateCategory = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Category.findOne({ categoryId: data.categoryId });
    if (result) {
      result.categoryName = data.categoryName;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Update category success!",
        data: result,
      });
    } else {
      throw new Error("This category does't exist!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const categoryController = {
  getAllCategory,
  getDetailCategory,
  createCategory,
  deleteCategory,
  updateCategory,
};

export default categoryController;
