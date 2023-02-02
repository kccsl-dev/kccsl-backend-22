import Account from "../models/account.js";
import Interest from "../models/interest";
import Transaction from "../models/transaction";

export const createAccount = async (accountDetails) => {
  try {
    const newAccount = await Account.create({ ...accountDetails });
    return newAccount;
  } catch (error) {
    console.log(error);
  }
};

export const updateAccount = async (id, updatedDetails) => {
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
      await updateAccount(account._id, {
        balance: newBalance,
        credits: [...account.credits, newTransaction],
      });
      console.log("Credit created");
    } else if (kind === "debit") {
      const newBalance = account.balance - amount;
      await updateAccount(account._id, {
        balance: newBalance,
        debits: [...account.debits, newTransaction],
      });
      console.log("Debit created");
    }
    console.log("transaction complete");
    return newTransaction;
  } catch (error) {}
};
