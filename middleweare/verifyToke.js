import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "missing token" });
  }
  const token = authHeader.split(" ")[1];
  console.log(token);

  jwt.verify(token, process.env.SECKRET_KEY, async (error, decode) => {
    if (error) {
      return res.status(403).json({ message: "Invalid Token" });
    }
    const user = await User.findOne({
      _id: decode.id,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user;
    next();
  });
};

export default verifyToken;
