import Page from "../model/page";
import { Request, Response } from "express";

const getAllPage = async (req: Request, res: Response) => {
  try {
    const result = await Page.find({});
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Get all page success!",
        listPage: result,
      });
    } else {
      throw new Error("There are no page!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getDetailPage = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const result = await Page.findById({ _id: id });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Get detail page success!",
        page: result,
      });
    } else {
      throw new Error("There are no page!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deletePage = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const result = await Page.findOneAndDelete({
      _id: id,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Delete page success!",
      });
    } else {
      throw new Error("This page is already deleted!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const createPage = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Page.create({
      name: data.name,
      description: data.description,
      content: data.content,
      datePublish: data.datePublish,
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "Create page page success!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const updatePage = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Page.findById({ _id: data.id });
    if (result) {
      result.name = data.name;
      result.description = data.description;
      result.content = data.content;
      result.datePublish = data.datePublish;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Update page success!",
        data: result,
      });
    } else {
      throw new Error("This page does't exist!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const pageController = {
  getAllPage,
  getDetailPage,
  createPage,
  deletePage,
  updatePage,
};

export default pageController;
