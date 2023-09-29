import express from "express";
import { User, generateJwtToken } from "../models/user.js";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { Otp } from "../models/otp.js";
import generateToken from "../utils/index-auth.js";
import jwt_decode from "jwt-decode";
import { isAuthenticated } from "../Authentication/auth.js";
const router = express.Router();
// SignUp
router.post("/signup", async (req, res) => {
  try {
    //  Find user is already registered
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(500).json({ message: "Email already exits" });

    // Generate HasedPassword
    const salt = await bcrypt.genSalt(10);
    const hasedPassword = await bcrypt.hash(req.body.password, salt);

    // New password Updation
    user = await new User({
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      password: hasedPassword,
    }).save();
    // Generate Token

    res.status(201).json({ message: "Successfully Signed Up" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Local server Error", error: error });
  }
});

/**  LogIn  */
router.post("/login", async (req, res) => {
  try {
    // Finding Existing User
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    // PAssword Validate
    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword) {
      return res.status(400).json({ message: "Invalid Creadentials" });
    }
    // TOken Generating
    const token = generateJwtToken(user._id);
    res.status(200).json({ message: "Logged in Successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
});

/* Once Verified Generate OTP */
router.post("/otp-generating", async (req, res) => {
  //  Finding User
  let user = await User.findOne({ email: req.body.email });
  // console.log(user);
  if (!user) {
    return res.status(404).json({ message: "User not Found" });
  }
  // Otp Generating
  const OTP = Math.random().toString(36).slice(-8);
  console.log(OTP);
  // Genarating Token
  const token = generateToken(user);
  // New Otp Update
  const otpUpdate = await new Otp({
    email: req.body.email,
    OTP: OTP,
    token: token,
  }).save();
  // Mailing Otp
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "panneerdeveloper77@gmail.com", // dotenv
      pass: "casl pbmw swve oumj",
    },
  });
  //  Mailing Details
  const message = {
    from: "panneerdeveloper77@gmail.com",
    to: user.email,
    subject: "Password reset request",
    text: `You are requested to rest your password. \n\n Your reset password OTP - ${OTP}`,
  };
  // Mail Status
  transporter.sendMail(message, (err, info) => {
    if (err) {
      res.status(404).json({ message: "Something went wrong", error: err });
    }

    res
      .status(200)
      .json({ token: token, data: "Password Email sent" + info.response });
  });
});

// Otp Verification
router.post("/otp-verify", async (req, res) => {
  // Checking USer via OTP
  let user = await Otp.findOne({ OTP: req.body.OTP });
  // Checking USer
  if (!user) {
    return res.status(404).json({ message: "Invalid OTP or Token" });
  }
  // Comparing OTP (sended via mail vs Entered )
  if (user.OTP === req.body.OTP) {
    return res.status(200).json({ data: "OTP verifed success " });
  }
});

// Password Rest
router.post("/password-reset", isAuthenticated, async (req, res) => {
  try {
    // Getting Token from header
    let token = req.headers.authorization;
    console.log(token);

    // Decoding with "jwt_decode"
    var decode = jwt_decode(token);
    console.log(decode);
    let user = await User.findOne({ _id: decode.id });
    // Finding User
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    // Encripting Pasword and Updating
    const hasedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hasedPassword;
    await user.save();
    res
      .status(200)
      .json({ message: `${user.email}, Your hase been updated successfully ` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
});

export const userRouter = router;
