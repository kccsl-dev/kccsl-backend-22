import Demand from "../models/demand.js";
import User from "../models/user.js";
import Transaction from "../models/transaction.js";
import Account from "../models/account.js";
import account from "../models/account.js";

export const getDemands = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const getTodayDemands = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const getDemandsByDate = async (req, res) => {
  try {
    const { from, to } = req.params;
    const columnNames = [
      "Debit_Acct_no",
      "Beneficiary Name",
      "Beneficiary Account No",
      "Bene_IFSC_Code",
      "Amount",
      "Debit narration",
      "Credit narration",
      "Mobile Number",
      "Email id",
      "Remark",
      "Pymt_Date",
    ];

    const newFrom = new Date(from);
    const newTo = new Date(to);
    newTo.setDate(newTo.getDate() + 2);
    const demands = await Demand.find({
      createdAt: { $gte: newFrom, $lte: newTo },
    });

    const rows = [];
    for (const demand of demands) {
      const member = await User.findById(demand.memberId);
      const final = {
        Debit_Acct_no: "181905001728",
        "Beneficiary Name": member.bankAccountDetails.accountHoldersName,
        "Beneficiary Account No": member.bankAccountDetails.accountNumber,
        Bene_IFSC_Code: member.bankAccountDetails.ifscCode,
        Amount: demand.amount,
        "Debit narration": "Kshitij Payout",
        "Credit narration": "",
        "Mobile Number": member._id,
        "Email id": member.personalInfo.emailAddress,
        Remark: "",
        Pymt_Date: new Date().toLocaleDateString(),
      };
      rows.push(final);
    }

    const demandReportData = {
      columnNames,
      rows,
    };
    res.status(200).json(demandReportData);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const getReportByDate = async (req, res) => {
  try {
    console.log("Generating Report");
    const { from, to } = req.params;
    const columnNames = [
      "Date",
      "TransactionId",
      "User ID Phone No",
      "Name of Coordinator",
      "Member/Coordinator",
      "User ID of New",
      "Name of New",
      "Shares Purchased",
      "Source",
      "Remark",
      "Credit/Debit",
      "Transaction Amount",
      "Transaction Mehtod",
      "Deposit/Loan Account",
      "Bank Deposit",
    ];

    const newFrom = new Date(from);
    const newTo = new Date(to);
    newTo.setDate(newTo.getDate() + 2);

    const transactions = await Transaction.find({
      createdAt: { $gte: newFrom, $lte: newTo },
    });

    const rows = [];
    for (const transaction of transactions) {
      const transactionAccount = await Account.findById(transaction.accountId);
      const isNewMemberCreated = transaction.remark.includes("created by");
      const isNewCoordinatorCreated =
        transaction.remark.includes("Coordinator by");

      let memberOrCoordinator = "N/A";
      let userIdOfNew = "N/A";
      let nameOfNew = "N/A";

      if (isNewMemberCreated) {
        memberOrCoordinator = "Member";
        if (transaction.remark.includes("UNKNOWN")) {
          userIdOfNew = "UNKNOWN";
          nameOfNew = "UNKNOWN";
        } else {
          const memberId = transaction.remark.slice(7, 20);
          const member = await User.findById(memberId);
          userIdOfNew = member._id;
          nameOfNew =
            member.personalInfo.firstName +
            " " +
            member.personalInfo.middleName +
            " " +
            member.personalInfo.lastName;
        }
      } else if (isNewCoordinatorCreated) {
        memberOrCoordinator = "Coordinator";
        if (transaction.source.includes("UNKNOWN")) {
          userIdOfNew = "UNKNOWN";
          nameOfNew = "UNKNOWN";
        } else {
          const coordinatorId = transaction.remark.slice(7, 20);
          const coordinator = await User.findById(coordinatorId);
          userIdOfNew = coordinator._id;
          nameOfNew =
            coordinator.personalInfo.firstName +
            " " +
            coordinator.personalInfo.middleName +
            " " +
            coordinator.personalInfo.lastName;
        }
      }

      let sharesPurchased = "N/A";
      if (isNewMemberCreated) {
        sharesPurchased = (transaction.amount - 10) / 10;
      } else if (transaction.remark.includes("shares")) {
        sharesPurchased = transaction.amount / 10;
      }

      const final = {
        Date: new Date(transaction.createdAt).toLocaleDateString(),
        TransactionId: transaction._id,
        "User ID Phone No": transactionAccount.userId,
        "Name of Coordinator": transactionAccount.accountHolderDetails.name,
        "Member/Coordinator": memberOrCoordinator,
        "User ID of New": userIdOfNew,
        "Name of New": nameOfNew,
        "Shares Purchased": sharesPurchased,
        Source: transaction.source,
        Remark: transaction.remark,
        "Credit/Debit": transaction.kind,
        "Transaction Amount": transaction.amount,
        "Transaction Mehtod": transaction.method,
        "Deposit/Loan Account": transaction.accountId,
        "Bank Deposit":
          transaction.method.toUpperCase() === "UPI" ? true : false,
      };
      rows.push(final);
    }

    const reportData = {
      columnNames,
      rows,
    };
    console.log("Report Sent");
    res.status(200).json(reportData);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const getDemand = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const makeDemand = async (req, res) => {
  try {
    const {
      accountNumber,
      accountId,
      amount,
      memberId,
      withdrawerCoordinatorId,
    } = req.body;
    console.log("raising payment demands");
    const newDemand = await Demand.create({
      accountNumber,
      accountId,
      amount,
      memberId,
      withdrawerCoordinatorId,
    });
    console.log("demand generated");
    res.status(200).json(newDemand);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
