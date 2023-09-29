import jwt from "jsonwebtoken";

const generateToken = (user) =>
  jwt.sign({ id: user.id }, process.env.SECKRET_KEY);

// module.exports = generateToken;

export default generateToken;
