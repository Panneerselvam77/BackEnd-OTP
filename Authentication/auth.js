import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const isAuthenticated = async (req, res, next) => {
  let token;
  if (req.headers) {
    try {
      token = req.headers.authorization;
      const decode = jwt.verify(token, process.env.SECKRET_KEY);
      console.log(decode);
      req.user = await User.findById(decode.id).select("_id name email");
      console.log(req.user);
      next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({ meassage: "Invalid Authorized " });
    }
  }
  if (!token) {
    return res.status(400).json({ message: "Acess Denaied" });
  }
};

export { isAuthenticated };
