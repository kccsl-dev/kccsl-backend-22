import { getAccounts, getLatestInterest } from "../middleware/finance";
import User from "../models/user.js";
import Account from "../models/account.js";
import Interest from "../models/interest.js";

export const getMemberAccounts = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json("User not found");
      return;
    }
    const accounts = await getAccounts(id);
    console.log("accounts found", accounts);
    res.status(200).json({ user: user, accounts: accounts });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const createNewAccount = async (req, res) => {
  try {
    const latestInterestScheme = await getLatestInterest();
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};
