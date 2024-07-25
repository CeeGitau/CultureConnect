import express from "express";
import { UserModel } from "../models/User.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "../config/.env" });

const Register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password, bio, image, ethnicity } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        error: [{ msg: "User already exists" }],
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new UserModel({
      name,
      email,
      password: hashPassword,
     
    });
    const result = await newUser.save();
    result._doc.password = undefined;
    return res.status(201).json({ success: true, ...result._doc });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

const Login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    const userExist = await UserModel.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        message: "User not found"
      });
    }
    const isPasswordOK = await bcrypt.compare(password, userExist.password);
    if (!isPasswordOK) {
      return res.status(400).json({
        message: "Password is incorrect!"
      });
    }
    const token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const user = { ...userExist._doc, password: undefined };
    return res.status(201).json({ success: true, user, token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};

const Auth = (req, res) => {
  return res.status(201).json({ success: true, user: { ...req.user._doc } });
};

export { Register, Login, Auth };
