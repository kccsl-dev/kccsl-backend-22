import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user";
import * as ft from "fast-two-sms";

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

export const assignAndSendOtp = async (phoneNumber) => {
  let otp = "";
  for (let i = 0; i != 6; i++) {
    let x = Math.round(Math.random() * 10);
    otp += x;
  }
  const now = new Date();
  now.setMinutes(now.getMinutes() + 10);
  const otpData = {
    value: otp,
    expiry: now,
  };
  const updatedUser = await User.findByIdAndUpdate(phoneNumber, {
    otpData: otpData,
  });

  const smsOptions = {
    authorization: process.env.SMSM_API_KEY,
    message: `Content of SMS ${otp} is the OTP for your membership application with KCCSL. By sharing this OTP with our member Cordinator, You accept the terms and conditions applicable for membership from time to time and agree to abide by them. Please do not share this with anyone else for security reasons.`,
    numbers: [phoneNumber.slice(3)],
    route: "q",
  };

  const smsResponse = await ft.sendMessage(smsOptions);
  console.log("SMS RESPONSE: ", smsResponse);
};
