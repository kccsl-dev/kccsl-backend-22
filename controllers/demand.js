import Demand from "../models/demand.js";
import User from "../models/user.js";

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
    const { from, to } = req.params;
    const columnNames = [
      "User ID Phone No",
      "Name of Coordinator",
      "Member/Coordinator",
      "User ID of New",
      "Name of New",
      "Shares Purchased",
      "Deposit/Loan Account",
    ];

    const newFrom = new Date(from);
    const newTo = new Date(to);
    newTo.setDate(newTo.getDate() + 2);

    const members = await User.find({
      createdAt: { $gte: newFrom, $lte: newTo },
    });

    const coordinators = await User.find({
      conversionDate: { $gte: newFrom, $lte: newTo },
    });

    const rows = [];

    for (const member of members) {
      const creator = await User.findById(member.creatorId);
      const final = {
        "User ID Phone No": member.creatorId,
        "Name of Coordinator":
          creator.personalInfo.firstName +
          " " +
          creator.personalInfo.middleName +
          " " +
          creator.personalInfo.lastName,
        "Member/Coordinator": "Member",
        "User ID of New": member._id,
        "Name of New":
          member.personalInfo.firstName +
          " " +
          member.personalInfo.middleName +
          " " +
          member.personalInfo.lastName,
        "Shares Purchased": member.shares.length,
      };
      rows.push(final);
    }

    for (const coordinator of coordinators) {
      const converter = await User.findById(coordinator.converterId);
      const final = {
        "User ID Phone No": coordinator.converterId,
        "Name of Coordinator":
          converter.personalInfo.firstName +
          " " +
          converter.personalInfo.middleName +
          " " +
          converter.personalInfo.lastName,
        "Member/Coordinator": "Coordinator",
        "User ID of New": coordinator._id,
        "Name of New":
          coordinator.personalInfo.firstName +
          " " +
          coordinator.personalInfo.middleName +
          " " +
          coordinator.personalInfo.lastName,
        "Shares Purchased": coordinator.shares.length,
      };
      rows.push(final);
    }

    const reportData = {
      columnNames,
      rows,
    };
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
