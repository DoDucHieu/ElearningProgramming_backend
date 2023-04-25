import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import AccessRight from "../model/history";

const verifyToken: RequestHandler = async (req, res, next) => {
  const header = req.header("Authorization");
  const token = header && header.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    let decode = jwt.verify(token, secret as string);
    const check = await AccessRight.findOne({ accessToken: token });
    if (check) {
      req.body.accessToken = token;
      return next();
    }
    return res.sendStatus(403);
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
};

const verifyTokenAdmin: RequestHandler = async (req, res, next) => {
  const header = req.header("Authorization");
  const token = header && header.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    let decode: any = jwt.verify(token, secret as string);
    if (decode.role === "admin") {
      const check = await AccessRight.findOne({ accessToken: token });
      if (check) {
        req.body.accessToken = token;
        return next();
      }
    }
    return res.sendStatus(403);
  } catch (error) {
    console.log(error);
    return res.sendStatus(403);
  }
};

let middleWare = {
  verifyToken,
  verifyTokenAdmin,
};

export default middleWare;
