import { updateAccountUtil } from "../middleware/finance";
import Account from "../models/account";
import Transaction from "../models/transaction";
import { checkPassword } from "../middleware/auth";

export const makeTransaction = async (req, res) => {
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
    } = req.body;
    let account;
    if (accountId !== null && accountId !== "") {
      console.log("creating transaction", req.body);
      account = await Account.findById(accountId);
      if (account === null) {
        res.status(404).json("Account not found");
        return;
      }
      if (!account.isActive) {
        res.status(404).json("Account is not active");
        return;
      }
    }
    let transactionBalance;
    if (kind === "credit") {
      transactionBalance = parseInt(account.balance) + parseInt(amount);
    } else if (kind === "debit") {
      transactionBalance = parseInt(account.balance) - parseInt(amount);
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
      accountBalance: parseInt(transactionBalance),
    });
    if (kind === "credit") {
      const newBalance = parseInt(account.balance) + parseInt(amount);
      await updateAccountUtil(account._id, {
        balance: parseInt(newBalance),
        credits: [...account.credits, newTransaction],
      });
    } else if (kind === "debit") {
      const newBalance = parseInt(account.balance) - parseInt(amount);
      await updateAccountUtil(account._id, {
        balance: parseInt(newBalance),
        debits: [...account.debits, newTransaction],
      });
    }
    console.log("transaction complete");
    res.status(200).json(newTransaction);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};
