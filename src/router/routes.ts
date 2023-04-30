import { Express, Request, Response } from "express";
import middleWare from "../middleware/middleware";
import productController from "../controller/productController";
import userController from "../controller/userController";
import authController from "../controller/authController";
import cartController from "../controller/cartController";
import commentController from "../controller/commentController";
import assessmentController from "../controller/assessmentController";
import categoryController from "../controller/categoryController";
import accessRightController from "../controller/accessRightController";
import newController from "../controller/newController";
import videoController from "../controller/videoController";
import orderController from "../controller/orderController";
import paymentController from "../controller/paymentController";
import courseController from "../controller/courseController";
import lessonController from "../controller/lessonController";
import myCourseController from "../controller/myCourseController";
import conversationController from "../controller/conversationController";
import messageController from "../controller/messageController";

const routes = (app: Express) => {
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  //sign in & sign up
  app.post("/sign-up", authController.signUp);
  app.post("/sign-in", authController.signIn);
  app.post("/sign-out", authController.signOut);
  app.post("/refresh-token", authController.refreshToken);
  app.post(
    "/change-password",
    middleWare.verifyToken,
    authController.changePassword
  );

  //product api
  app.get("/get-all-product", productController.getAllProduct);
  app.get("/get-detail-product", productController.getDetailProduct);
  app.delete(
    "/delete-product",
    middleWare.verifyToken,
    productController.deleteProduct
  );
  app.post(
    "/add-product",
    middleWare.verifyToken,
    productController.addProduct
  );
  app.put(
    "/update-product",
    middleWare.verifyToken,
    productController.updateProduct
  );

  //user api
  app.get(
    "/get-all-user",
    middleWare.verifyTokenAdmin,
    userController.getAllUser
  );
  app.get(
    "/get-detail-user",
    middleWare.verifyToken,
    userController.getDetailUser
  );
  app.get(
    "/get-detail-user-by-id",
    middleWare.verifyToken,
    userController.getDetailUserById
  );
  app.post("/add-user", middleWare.verifyTokenAdmin, userController.addUser);
  app.put("/edit-user", middleWare.verifyToken, userController.editUser);
  app.delete(
    "/delete-user",
    middleWare.verifyTokenAdmin,
    userController.deleteUser
  );
  app.post(
    "/block-user",
    middleWare.verifyTokenAdmin,
    userController.blockUser
  );

  //cart api
  app.get(
    "/get-all-cart",
    middleWare.verifyToken,
    cartController.getAllCartByEmail
  );
  app.post(
    "/add-to-cart",
    middleWare.verifyToken,
    cartController.AddOrUpdateCart
  );
  app.delete(
    "/remove-from-cart",
    middleWare.verifyToken,
    cartController.removeFromCart
  );

  app.delete(
    "/delete-all-cart",
    middleWare.verifyToken,
    cartController.deleteAllCartByEmail
  );

  //order api
  app.get(
    "/get-all-order",
    middleWare.verifyToken,
    orderController.getAllOrder
  );
  app.get(
    "/get-detail-order",
    middleWare.verifyToken,
    orderController.getDetailOrder
  );
  app.post("/add-order", middleWare.verifyToken, orderController.AddOrder);
  app.post("/edit-order", middleWare.verifyToken, orderController.editOrder);
  app.delete(
    "/delete-order",
    middleWare.verifyToken,
    orderController.deleteOrder
  );
  //payment api
  app.post(
    "/stripe/create-checkout-session",
    middleWare.verifyToken,
    paymentController.checkOut
  );

  //comment api
  app.get(
    "/get-all-comment",
    middleWare.verifyToken,
    commentController.getAllComment
  );
  app.post(
    "/add-comment",
    middleWare.verifyToken,
    commentController.addComment
  );
  app.put(
    "/edit-comment",
    middleWare.verifyToken,
    commentController.editComment
  );
  app.delete(
    "/delete-comment",
    middleWare.verifyToken,
    commentController.deleteComment
  );

  //assessment api
  app.get(
    "/get-all-assessment",
    middleWare.verifyToken,
    assessmentController.getAllAssessmentByProductId
  );
  app.post(
    "/add-assessment",
    middleWare.verifyToken,
    assessmentController.addAssessment
  );
  app.put(
    "/update-assessment",
    middleWare.verifyToken,
    assessmentController.updateAssessment
  );
  app.delete(
    "/delete-assessment",
    middleWare.verifyToken,
    assessmentController.deleteAssessment
  );

  //category api
  app.get("/get-all-category", categoryController.getAllCategory);
  app.get("/get-detail-category", categoryController.getDetailCategory);
  app.post(
    "/add-category",
    middleWare.verifyToken,
    categoryController.createCategory
  );
  app.put(
    "/update-category",
    middleWare.verifyToken,
    categoryController.updateCategory
  );
  app.delete(
    "/delete-category",
    middleWare.verifyToken,
    categoryController.deleteCategory
  );

  // access right api
  app.get(
    "/get-all-access-right",
    middleWare.verifyToken,
    accessRightController.getAllAccessRight
  );
  app.get(
    "/get-detail-access-right",
    middleWare.verifyToken,
    accessRightController.getDetailAccessRight
  );
  app.post(
    "/add-access-right",
    middleWare.verifyToken,
    accessRightController.createAccessRight
  );
  app.put(
    "/update-access-right",
    middleWare.verifyToken,
    accessRightController.updateAccessRight
  );
  app.delete(
    "/delete-access-right",
    middleWare.verifyToken,
    accessRightController.deleteAccessRight
  );

  // news api
  app.get("/get-all-new", newController.getAllNew);
  app.get("/get-detail-new", newController.getDetailNew);
  app.post("/add-new", middleWare.verifyToken, newController.addNew);
  app.put("/edit-new", middleWare.verifyTokenAdmin, newController.editNew);
  app.delete("/delete-new", middleWare.verifyToken, newController.deleteNew);
  app.put(
    "/approve-new",
    middleWare.verifyTokenAdmin,
    newController.approveNew
  );
  app.put("/increase-view-new", newController.increaseView);

  // video api
  app.get("/get-all-video", videoController.getAllVideo);
  app.get("/get-detail-video", videoController.getDetailVideo);
  app.post("/add-video", middleWare.verifyToken, videoController.addVideo);
  app.put(
    "/edit-video",
    middleWare.verifyTokenAdmin,
    videoController.editVideo
  );
  app.delete(
    "/delete-video",
    middleWare.verifyToken,
    videoController.deleteVideo
  );
  app.put(
    "/approve-video",
    middleWare.verifyTokenAdmin,
    videoController.approveVideo
  );
  app.put("/increase-view-video", videoController.increaseView);

  // course api
  app.get("/get-all-course", courseController.getAllCourse);
  app.get("/get-all-free-course", courseController.getAllFreeCourse);
  app.get("/get-all-pro-course", courseController.getAllProCourse);
  app.get("/get-detail-course", courseController.getDetailCourse);
  app.post("/add-course", middleWare.verifyToken, courseController.addCourse);
  app.put(
    "/edit-course",
    middleWare.verifyTokenAdmin,
    courseController.editCourse
  );
  app.delete(
    "/delete-course",
    middleWare.verifyToken,
    courseController.deleteCourse
  );
  app.post(
    "/increase-registry-course",
    courseController.increaseRegistryCourse
  );

  // lesson api
  app.get("/get-all-lesson", lessonController.getAllLesson);
  app.get("/get-detail-lesson", lessonController.getDetailLesson);
  app.post("/add-lesson", middleWare.verifyToken, lessonController.addLesson);
  app.put(
    "/edit-lesson",
    middleWare.verifyTokenAdmin,
    lessonController.editLesson
  );
  app.delete(
    "/delete-lesson",
    middleWare.verifyToken,
    lessonController.deleteLesson
  );

  // my-course api
  app.get(
    "/get-all-my-course",
    middleWare.verifyToken,
    myCourseController.getAllMyCourse
  );
  app.post(
    "/registry-course",
    middleWare.verifyToken,
    myCourseController.registryCourse
  );
  app.delete(
    "/delete-my-course",
    middleWare.verifyToken,
    myCourseController.deleteMyCourse
  );

  app.post(
    "/delete-many-my-course",
    middleWare.verifyToken,
    myCourseController.deleteManyMyCourse
  );

  app.get(
    "/get-detail-my-course",
    middleWare.verifyToken,
    myCourseController.getDetailMyCourse
  );

  // conversation api
  app.get(
    "/get-all-conversation",
    middleWare.verifyToken,
    conversationController.getAllConversation
  );
  app.get(
    "/get-detail-conversation",
    middleWare.verifyToken,
    conversationController.getDetailConversation
  );
  app.post(
    "/add-conversation",
    middleWare.verifyToken,
    conversationController.addConversation
  );
  app.put(
    "/edit-conversation",
    middleWare.verifyToken,
    conversationController.editConversation
  );
  app.delete(
    "/delete-conversation",
    middleWare.verifyToken,
    conversationController.deleteConversation
  );

  // message api
  app.get(
    "/get-all-message",
    middleWare.verifyToken,
    messageController.getAllMessage
  );
  app.post(
    "/add-message",
    middleWare.verifyToken,
    messageController.addMessage
  );
  app.delete(
    "/delete-message",
    middleWare.verifyToken,
    messageController.deleteMessage
  );
};

export default routes;
