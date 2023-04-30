import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../model/user";
import AccessRight from "../model/accessRight";
import { Request, Response } from "express";

export const generateToken = (payload: any) => {
  const secretAccessToken = process.env.ACCESS_TOKEN_SECRET;
  const secretRefreshToken = process.env.REFRESH_TOKEN_SECRET;
  const accessToken = jwt.sign(payload, secretAccessToken, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(payload, secretRefreshToken, {
    expiresIn: "1d",
  });
  return { accessToken, refreshToken };
};

const comparePassword = async (
  clientPassword: string,
  serverPassword: string
) => {
  try {
    let validPassword = await bcrypt.compare(clientPassword, serverPassword);
    return validPassword;
  } catch (e) {
    console.log(e);
  }
};

const signUp = async (req: Request, res: Response) => {
  try {
    let userData = req.body;
    const checkExist = await User.findOne({ email: userData.email });
    if (checkExist) {
      throw new Error("This user name is already exists!");
    } else {
      const salt = await bcrypt.genSalt(10);
      let hashPassword = await bcrypt.hash(userData.password, salt);
      const result = await User.create({
        email: userData.email,
        password: hashPassword,
        role: "user",
        fullName: "",
      });
      if (result) {
        const { accessToken, refreshToken } = generateToken({
          email: result.email,
          role: result.role,
          fullName: result.fullName,
        });
        await AccessRight.create({
          userId: result._id,
          accessToken,
          refreshToken,
          is_blockeded: false,
        });
        return res.status(200).json({
          errCode: 0,
          errMessage: "Create new account success",
          userInfor: result,
          accessToken,
          refreshToken,
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

const signIn = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const checkExist = await User.findOne({
      email: userData.email,
    });
    if (checkExist) {
      if (checkExist.is_blocked)
        return res.status(200).json({
          errCode: 1,
          errMessage: "This account has been blocked!",
        });
      const compare = await comparePassword(
        userData.password,
        checkExist.password
      );
      if (compare) {
        let { accessToken, refreshToken } = generateToken({
          email: userData.email,
          role: checkExist.role,
          fullName: checkExist.fullName,
        });
        const record = await AccessRight.findOne({
          userId: checkExist._id,
        });
        if (record) {
          record.accessToken = accessToken;
          record.refreshToken = refreshToken;
          await record.save();
        } else
          await AccessRight.create({
            userId: checkExist._id,
            accessToken,
            refreshToken,
            is_blockeded: false,
          });
        return res.status(200).json({
          errCode: 0,
          errMessage: "Sign in success",
          user_id: checkExist._id,
          email: userData.email,
          role: checkExist.role,
          fullName: checkExist.fullName,
          avatar: checkExist.avatar,
          accessToken,
          refreshToken,
        });
      } else {
        throw new Error("Password incorrect!");
      }
    } else {
      throw new Error("Email incorrect!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const signOut = async (req: Request, res: Response) => {
  try {
    const record = await AccessRight.findOne({
      refreshToken: req.body.refreshToken,
    });
    if (record) {
      record.accessToken = null;
      record.refreshToken = null;
      await record.save();
      return res.status(200).json({ message: "Log out success!" });
    } else return res.sendStatus(403);
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const decode: any = jwt.verify(userData.refreshToken, secret as string);
    console.log(decode);
    const record = await AccessRight.findOne({
      refreshToken: userData.refreshToken,
    });
    if (record) {
      const token = generateToken({
        email: decode.email,
        role: decode.role,
        fullName: decode.fullName,
      });
      record.accessToken = token.accessToken;
      record.refreshToken = token.refreshToken;
      await record.save();
      const userDataRes = {
        user_id: record.userId,
        email: decode.email,
        role: decode.role,
        fullName: decode.fullName,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      };
      return res
        .status(200)
        .json({ message: "Refresh token success!", data: userDataRes });
    } else return res.sendStatus(403);
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    const userData = req.body;
    const checkExist = await User.findOne({
      email: userData.email,
    });
    if (checkExist) {
      const compare = await comparePassword(
        userData.password,
        checkExist.password
      );
      if (compare) {
        const salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(userData.newPassword, salt);
        checkExist.password = hashPassword;
        await checkExist.save();

        let { accessToken, refreshToken } = generateToken({
          email: userData.email,
          role: checkExist.role,
          fullName: checkExist.fullName,
        });
        const record = await AccessRight.findOne({
          userId: checkExist._id,
        });
        if (record) {
          record.accessToken = accessToken;
          record.refreshToken = refreshToken;
          await record.save();
        } else
          await AccessRight.create({
            userId: checkExist._id,
            accessToken,
            refreshToken,
            is_blockeded: false,
          });
        return res.status(200).json({
          errCode: 0,
          errMessage: "Change password success",
          user_id: checkExist._id,
          email: userData.email,
          role: checkExist.role,
          fullName: checkExist.fullName,
          accessToken,
          refreshToken,
        });
      } else {
        throw new Error("Password incorrect!");
      }
    } else {
      throw new Error("Email incorrect!");
    }
  } catch (e) {
    return res.status(500).json({
      errCode: 1,
      errMessage: e.message,
    });
  }
};

const authController = {
  signUp,
  signIn,
  signOut,
  refreshToken,
  changePassword,
};

export default authController;
