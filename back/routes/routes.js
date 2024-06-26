import express from "express";
import { Register, Login, Auth } from "../controllers/userController.js";
const router = express.Router();
import { body } from "express-validator";
import { VerifyUser } from "../middleware/verifyUser.js";
import {
  addConversation,
  getConversations,
  getConversation,
  deleteConversation,
  updateConversation,
  createComment,
  getComments,
} from "../controllers/conversationController.js";

router.post(
  "/register",
  [
    (body("name")
      .trim()
      .notEmpty()
      .withMessage("This field should not be empty"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("This field should not be empty")
      .isEmail()
      .withMessage("Invalid e-mail address"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("This field should not be empty")
      .isLength({ min: 8, max: 30 })
      .withMessage("Password length should be 8-30 characters")),
  ],
  Register
);

router.post(
  "/login",
  [
    (body("email")
      .trim()
      .notEmpty()
      .withMessage("This field should not be empty")
      .isEmail()
      .withMessage("Invalid e-mail address"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("This field should not be empty")
      .isLength({ min: 8, max: 30 })
      .withMessage("Password length should be 8-30 characters")),
  ],
  Login
);

router.get("/verify", VerifyUser, Auth);

//conversation Routes
router.post("/addConversation", VerifyUser, addConversation);
router.get("/conversations", VerifyUser, getConversations);
router.get("/conversation/:id", VerifyUser, getConversation);
router.put("/update-conversation/:id", VerifyUser, updateConversation);
router.delete("/conversation/:id", VerifyUser, deleteConversation);
router.post("/comments", VerifyUser, createComment);
router.get("/comments/:conversationId", VerifyUser, getComments);

export { router as Router };
