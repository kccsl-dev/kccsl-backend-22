import Account from "../models/account.js";
import Interest from "../models/interest";
import Sequence from "../models/sequence.js";
import Transaction from "../models/transaction";

export const createAccountUtil = async (accountDetails, id) => {
  try {
    console.log("Util: creating account");
    console.log(accountDetails);
    const sequence = await Sequence.findOne();
    const currentNumber = sequence[accountDetails.type];
    const accountNumber = id || accountDetails.type + currentNumber;
    const newAccount = await Account.create({
      ...accountDetails,
      accountNumber: accountNumber,
      _id: accountNumber,
    });
    console.log("Util: done");
    if (accountDetails.type !== "s" && accountDetails.type !== "c") {
      await Sequence.findOneAndUpdate({
        [accountDetails.type]: currentNumber + 1,
      });
    }
    console.log("updated sequence");
    return newAccount;
  } catch (error) {
    console.log(error);
  }
};

export const updateAccountUtil = async (id, updatedDetails) => {
  try {
    const updatedAccount = Account.findByIdAndUpdate(id, { ...updatedDetails });
    return updatedAccount;
  } catch (error) {
    console.log(error);
  }
};

export const getAccounts = async (id, showCollectionAccount = false) => {
  try {
    const accounts = await Account.find({ userId: id });
    return accounts;
  } catch (error) {
    console.log(error);
  }
};

export const getLatestInterest = async () => {
  try {
    const docs = await Interest.find({
      applicableFrom: {
        $lt: new Date(),
      },
    }).sort("-createdAt");
    return docs[0];
  } catch (error) {
    console.log(error);
  }
};

export const createTransactionEntry = async (args) => {
  try {
    const {
      amount,
      accountId,
      remark,
      kind,
      source,
      method,
      breakDown,
      proof,
    } = args;
    console.log(args);
    let account;
    console.log("Creating new transaction");
    if (accountId !== null && accountId !== "") {
      account = await Account.findById(accountId);
      console.log(account);
      if (account === null) {
        console.log("Account not found");
        throw new Error({ message: "Account not found" });
        return;
      }
      if (!account.isActive) {
        console.log("Account not active");
        throw new Error({ message: "Account not active" });
        return;
      }
    }
    const newTransaction = await Transaction.create({
      amount,
      accountId,
      remark,
      kind,
      breakDown,
      source,
      method,
      proof,
    });
    if (kind === "credit") {
      const newBalance = account.balance + amount;
      await updateAccountUtil(account._id, {
        balance: newBalance,
        credits: [...account.credits, newTransaction],
      });
      console.log("Credit created");
    } else if (kind === "debit") {
      const newBalance = account.balance - amount;
      await updateAccountUtil(account._id, {
        balance: newBalance,
        debits: [...account.debits, newTransaction],
      });
      console.log("Debit created");
    }
    console.log("transaction complete");
    return newTransaction;
  } catch (error) {
    console.log(error);
    return error;
  }
};
