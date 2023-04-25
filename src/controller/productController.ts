import Category from "../model/category";
import Product from "../model/product";
import { Request, Response } from "express";

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const page: number = Number(req.query.page);
    const size: number = Number(req.query.size);
    const keyword: any = req.query.keyword || "";
    const reqSortPrice: any = req.query.sortPrice || "";
    let minPrice: number;
    let maxPrice: number;
    if (reqSortPrice) {
      minPrice = JSON.parse(reqSortPrice)?.minPrice;
      maxPrice = JSON.parse(reqSortPrice)?.maxPrice;
    }

    const categoryName: any = req.query.filter
      ? `${req.query.filter}`.split(",")
      : [];
    let listCategory: any = [];
    const temp: any = await Category.find({});
    if (temp) listCategory = temp.map((item: any) => item?.categoryName);

    const resultTotal = await Product.find({
      productName: { $regex: keyword },
    });

    const result = await Product.find({
      $or: [{ productName: { $regex: keyword } }],
      $and: [
        {
          price: {
            $gt: minPrice ?? 0,
          },
        },
        {
          price: {
            $lte: maxPrice ?? 999999,
          },
        },
      ],
      // ...(categoryName && { categoryName }),
    })
      .where("categoryName")
      .in(categoryName.length > 0 ? [...categoryName] : [...listCategory])
      .skip(size * (page - 1))
      .limit(size);
    if (result && resultTotal) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Get all product success!",
        listProduct: result,
        totalRecord: resultTotal.length,
      });
    } else {
      throw new Error("There are no product!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const getDetailProduct = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const result = await Product.findById({ _id: id });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Get detail product success!",
        product: result,
      });
    } else {
      throw new Error("There are no product!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.query.id;
    const result = await Product.findOneAndDelete({
      _id: id,
    });
    if (result) {
      return res.status(200).json({
        errCode: 0,
        errMessage: "Delete product success!",
      });
    } else {
      throw new Error("This product is already deleted!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Product.create({
      productName: data.productName,
      description: data.description,
      categoryName: data.categoryName,
      imgUrl: data.imgUrl,
      price: data.price,
      datePublish: data.datePublish,
    });

    return res.status(200).json({
      errCode: 0,
      errMessage: "Create new product success!",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await Product.findById({ _id: data._id });
    if (result) {
      result.description = data.description;
      result.datePublish = data.datePublish;
      result.price = data.price;
      result.categoryName = data.categoryName;
      result.imgUrl = data.imgUrl;
      await result.save();
      return res.status(200).json({
        errCode: 0,
        errMessage: "Update product success!",
        data: result,
      });
    } else {
      throw new Error("This product does't exist!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const productController = {
  getAllProduct,
  getDetailProduct,
  addProduct,
  deleteProduct,
  updateProduct,
};

export default productController;
