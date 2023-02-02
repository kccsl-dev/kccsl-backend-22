import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCusttomToken = token.length < 500;

    let decodedData;

    if (token && isCusttomToken) {
      decodedData = jwt.verify(token, "test");

      req.userId = decodedData?._id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }

    next();
  } catch (error) {
    console.log("invalid auth");
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export default auth;

export const checkPassword = async (id, password) => {
  const user = await User.findById(id);
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  return isPasswordCorrect;
};
