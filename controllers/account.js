import {
  createAccountUtil,
  createTransactionEntry,
  getAccounts,
  recalculateCreditLine,
  updateAccountUtil,
} from "../middleware/finance";
import Account from "../models/account.js";
import User from "../models/user.js";
import Sequence from "../models/sequence";
import Demand from "../models/demand";

export const getMemberAccounts = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json("User not found");
      return;
    }
    const accounts = await getAccounts(id);
    const invalid = ["C"];
    const memberAccounts = accounts.filter(
      (account) => !invalid.includes(account.type)
    );
    console.log("accounts found", memberAccounts);
    res.status(200).json({ user: user, accounts: memberAccounts });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const getCoordinatorPendingLoans = async (req, res) => {
  try {
    const { id } = req.params;
    const coordinator = await User.findById(id);
    //get loans
    const loans = await Account.find({
      _id: {
        $in: coordinator.pendingLoans,
      },
    });

    //get users
    const userIds = loans.map((loan) => loan.userId);
    const users = await User.find({
      _id: {
        $in: userIds,
      },
    });

    //organise data
    const data = [];
    loans.forEach((loan) => {
      const user = users.find((user) => user._id === loan.userId);
      const obj = {
        user,
        loan,
      };
      data.push(obj);
    });
    res.status(200).json(data);
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
      goesToCredit: true,
    });
    console.log("transaction done");

    await User.findByIdAndUpdate(userId, {
      $push: { accounts: newAccount._id },
    });

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

export const createLoan = async (req, res) => {
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
      isLoan,
      status,
      guarenters,
    } = req.body;
    console.log(req.body);
    console.log("creating new account");

    const newAccount = await createAccountUtil(
      {
        accountHolderDetails,
        credits,
        debits,
        userId,
        type,
        creatorId,
        principalAmounts,
        balance: balance * -1,
        duration,
        matureDate,
        interestApplicable,
        monthlyAmount,
        monthlyDate,
        isActive,
        isLoan,
        status,
        guarenters,
      },
      null,
      true
    );
    console.log("done");

    console.log("updating credit line");
    const member = await User.findByIdAndUpdate(newAccount.userId, {
      $push: { accounts: newAccount._id },
    });
    console.log("done");

    console.log("updating pending list");
    const coordinator = await User.findByIdAndUpdate(
      member.parentIds[member.parentIds.length - 1],
      {
        $push: { pendingLoans: newAccount._id },
      }
    );

    res.status(200).json(newAccount);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const { id, updateData } = req.body;
    const updatedAccount = await updateAccountUtil(id, updateData);
    res.status(200).json(updatedAccount);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const denyLoan = async (req, res) => {
  try {
    console.log("denying loan");
    const { id, coordinatorId } = req.body;
    const updatedAccount = await updateAccountUtil(id, { status: "DENIED" });
    await User.findByIdAndUpdate(coordinatorId, {
      $pullAll: { pendingLoans: [id] },
    });
    res.status(200).json(updatedAccount);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const approveLoan = async (req, res) => {
  try {
    console.log("denying loan");
    const { id, coordinatorId } = req.body;
    const updatedAccount = await updateAccountUtil(id, { status: "APPROVED" });
    const coordinator = await User.findByIdAndUpdate(coordinatorId, {
      $pullAll: { pendingLoans: [id] },
    });

    //generate demand
    console.log("raising payment demand");
    const newDemand = await Demand.create({
      accountNumber: updatedAccount.accountNumber,
      accountId: updatedAccount._id,
      amount: updatedAccount.balance * -1,
      membedId: updatedAccount.userId,
      withdrawerCoordinatorId: coordinator._id,
    });
    console.log("demand generated");

    //grant incentive
    const totalIncentiveRate = 0.01;
    const totalIncentiveAmount =
      Math.round(updatedAccount.balance * -1 * totalIncentiveRate * 100) / 100;
    console.log(
      `INCENTIVE: ${totalIncentiveAmount} (@ ${totalIncentiveRate}%)`
    );
    if (isNaN(totalIncentiveAmount)) {
      throw new Error("Incentive cannot be NaN");
    }
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
          remark: `Incentive for ${updatedAccount._id} loan generation`,
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
    res.status(200).json(updatedAccount);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
