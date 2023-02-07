import {
  createAccountUtil,
  createTransactionEntry,
  getAccounts,
} from "../middleware/finance";
import Account from "../models/account.js";
import User from "../models/user.js";
import Sequence from "../models/sequence";
import user from "../models/user.js";

export const getMemberAccounts = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json("User not found");
      return;
    }
    const accounts = await getAccounts(id);
    const memberAccounts = accounts.filter((account) => account.type !== "C");
    console.log("accounts found", memberAccounts);
    res.status(200).json({ user: user, accounts: memberAccounts });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const getMemberAccount = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`sending account ${id}`);
    const account = await Account.findById(id);
    res.status(200).json(account);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const createNewAccount = async (req, res) => {
  try {
    const {
      accountHolderDetails,
      credits,
      debits,
      userId,
      type,
      creatorId,
      principalAmounts,
      balance,
      duration,
      matureDate,
      interestApplicable,
      monthlyAmount,
      monthlyDate,
      isActive,
    } = req.body;
    // const latestInterestScheme = await getLatestInterest();
    console.log(req.body);
    console.log("creating new account");

    const newAccount = await createAccountUtil({
      accountHolderDetails,
      credits,
      debits,
      userId,
      type,
      creatorId,
      principalAmounts,
      balance: 0,
      duration,
      matureDate,
      interestApplicable,
      monthlyAmount,
      monthlyDate,
      isActive,
    });
    console.log("done");

    console.log("Making initial transaction");
    const firstTransaction = await createTransactionEntry({
      amount: principalAmounts[0],
      accountId: newAccount._id,
      remark: "Initial transaction",
      kind: "credit",
      source: "Member -- Collected",
      method: "internal",
      breakDown: "null",
      proof: "null",
    });
    console.log("transaction done");
    res.status(200).json(newAccount);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};

export const buyShares = async (req, res) => {
  try {
    const { id, noOfShares } = req.body;
    const sequence = await Sequence.findOne();
    const currentShareNumber = sequence.shares;
    const currentShareReceiptNumber = sequence.shareReceipt;
    const newShareNumber = currentShareNumber + parseInt(noOfShares) - 1;

    const shares = [];
    for (let share = currentShareNumber; share <= newShareNumber; share++) {
      shares.push(share.toString());
    }
    const today = new Date();
    console.log(id, noOfShares, shares);
    const shareDetailsObj = {
      datePurchased: today,
      noOfShares: noOfShares,
      rn: `${currentShareReceiptNumber}/${today.getMonth()}/${today.getFullYear()}`,
      isMemberCreation: false,
    };

    const updatedUser = await user.findByIdAndUpdate(id, {
      $push: { shares: { $each: shares }, shareDetails: shareDetailsObj },
    });
    console.log("Shares bought");

    await Sequence.findOneAndUpdate({
      shares: currentShareNumber + noOfShares + 1,
      shareReceipt: currentShareReceiptNumber + 1,
    });
    console.log("Share sequence updated");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
