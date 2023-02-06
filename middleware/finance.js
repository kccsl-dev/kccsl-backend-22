import Account from "../models/account.js";
import Interest from "../models/interest";
import Sequence from "../models/sequence.js";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";

export const createAccountUtil = async (accountDetails, id) => {
  try {
    console.log("Util: creating account");
    console.log(accountDetails);
    const sequence = await Sequence.findOne();
    const currentNumber = sequence[accountDetails.type];
    const accountNumber =
      id || accountDetails.type.toUpperCase() + currentNumber;
    console.log(15, accountNumber);
    const newAccount = await Account.create({
      ...accountDetails,
      accountNumber: accountNumber,
      type: accountDetails.type.toUpperCase(),
      _id: accountNumber,
    });
    console.log("Util: done");
    if (accountDetails.type !== "s" && accountDetails.type !== "c") {
      await Sequence.findOneAndUpdate({
        [accountDetails.type]: currentNumber + 1,
      });
      const coordinator = await User.findByIdAndUpdate(
        accountDetails.creatorId,
        {
          $push: { subAccounts: newAccount._id },
        }
      );
      const applicableInterest = await Interest.findById(
        accountDetails.interestApplicable[0]
      );

      //adding interest
      //TODO: Move to separate thread
      const accountInterest =
        applicableInterest[accountDetails.type + accountDetails.duration];
      const totalIncentiveRate =
        Math.round((accountInterest / 2) * 100) / 100 / 100;
      const totalIncentiveAmount =
        Math.round(
          accountDetails.principalAmounts[0] * totalIncentiveRate * 100
        ) / 100;
      console.log(
        `INCENTIVE: ${totalIncentiveAmount} (@ ${totalIncentiveRate}%)`
      );
      const parentIds = [...coordinator.parentIds, coordinator._id];
      parentIds.reverse();
      let remainder = totalIncentiveAmount;
      for (let i = 0; i < parentIds.length; i++) {
        const parentId = parentIds[i];
        let amount;
        if (i === parentIds.length - 1) {
          amount = remainder;
        } else {
          amount = Math.round(remainder * 0.7 * 100) / 100;
          console.log(`Amount: ${amount}, with remainder ${remainder}`);
        }
        remainder = Math.round((remainder - amount) * 100) / 100;
        console.log(`new remainder: ${remainder}`);

        const accountId = (await User.findById(parentId)).mainSavingsAccount;
        await createTransactionEntry(
          {
            amount: amount,
            accountId: accountId,
            remark: `Incentive for ${newAccount._id} collection`,
            kind: "credit",
            source: "society",
            method: "internal",
            breakDown: "null",
            proof: "null",
          },
          true
        );
        console.log(`Incentive of ${amount} given to ${parentId}`);
        console.log(`Remaining incentive: ${remainder}`);
      }
    }
    console.log("updated sequence and incentive");
    return newAccount;
  } catch (error) {
    console.log(error);
    return error;
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

export const createTransactionEntry = async (args, isIncentive) => {
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
      }
      if (!account.isActive) {
        console.log("Account not active");
        throw new Error({ message: "Account not active" });
      }
    }

    let transactionBalance;
    if (kind === "credit") {
      transactionBalance = parseInt(account.balance) + parseInt(amount);
    } else if (kind === "debit") {
      transactionBalance = parseInt(account.balance) - parseInt(amount);
    }
    console.log(156, transactionBalance);
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
      console.log("Credit created");
    } else if (kind === "debit") {
      const newBalance = parseInt(account.balance) - parseInt(amount);
      await updateAccountUtil(account._id, {
        balance: parseInt(newBalance),
        debits: [...account.debits, newTransaction],
      });
      console.log("Debit created");
    }
    if (isIncentive) {
      await User.findByIdAndUpdate(account.userId, {
        $inc: { totalIncentive: amount },
      });
      console.log("Incentive given.");
    }
    console.log("transaction complete");
    return newTransaction;
  } catch (error) {
    console.log(error);
    return error;
  }
};
