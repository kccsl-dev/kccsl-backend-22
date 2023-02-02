import { getLatestInterest } from "../middleware/finance";
import Interest from "../models/interest";
import { generateInterestDoc } from "../utils/generateInterest";

export const getCurrentInterest = async (req, res) => {
  try {
    const interest = await getLatestInterest();
    res.status(200).json(interest);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};

export const createInterest = async (req, res) => {
  try {
    const { baseRate, applicableFrom } = req.body;
    const applicableFromDate = new Date(applicableFrom);
    console.log(applicableFromDate);
    const newInterest = generateInterestDoc(baseRate);
    const latestInterest = await Interest.create({
      ...newInterest,
      applicableFrom: applicableFromDate,
    });
    res.status(200).json(latestInterest);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};
