import User from "../models/user.js";
import Sequence from "../models/sequence.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  createAccount,
  createTransactionEntry,
  updateAccount,
} from "../middleware/finance";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Sending user... ", id);
    const user = await User.findById(id);
    if (user === null) {
      res.status(404).json("Member not found. ");
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const checkId = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user !== null) {
      res
        .status(400)
        .json({ message: "Account with this phone number already exists." });
      return;
    }
    res.status(200).json("No user");
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const createUser = async (req, res) => {
  const {
    phoneNumber,
    roles,
    personalInfo,
    creatorId,
    permanentAddress,
    currentAddress,
    bankAccountDetails,
    nomineeDetails,
    parentIds,
    hasBeenActivated,
    noOfShares,
  } = req.body;
  try {
    const existingUser = await User.findById(phoneNumber);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists. " });
    }
    console.log(personalInfo);

    const hashed = await bcrypt.hash("password", 12);

    const memberSequqnce = (await Sequence.find({ name: "member" }))[0];
    const memberId = memberSequqnce.value;
    const shareSequence = (await Sequence.find({ name: "shares" }))[0];
    const currentShareNumber = shareSequence.value;
    const newShareNumber = currentShareNumber + noOfShares - 1;

    const shares = [];
    for (let share = currentShareNumber; share <= newShareNumber; share++) {
      shares.push(share.toString());
    }

    const accountDetails = {
      accountHolderDetails: {
        name:
          personalInfo.firstName +
          personalInfo.middleName +
          personalInfo.lastName,
        dateOfBirth: personalInfo.dateOfBirth,
        gender: personalInfo.gender,
        emailAddress: personalInfo.emailAddress,
        aadharNumber: personalInfo.aadharNumber,
        panNumber: personalInfo.panNumber,
      },
      userId: phoneNumber,
      credits: [],
      debits: [],
      creatorId: creatorId,
      balance: 0,
    };
    console.log("Creating savings account...");
    const mainSavingsAccount = await createAccount({
      ...accountDetails,
      accountNumber: `S${memberId}`,
      type: "s",
      isActive: true,
    });
    console.log("Done: " + mainSavingsAccount._id);

    console.log("Creating collection account...");
    const collectionAccount = await createAccount({
      ...accountDetails,
      accountNumber: `C${memberId}`,
      type: "c",
      isActive: false,
    });
    console.log("Done: " + collectionAccount._id);

    console.log("Creating user...");
    const creationData = {
      _id: phoneNumber,
      phoneNumber,
      password: hashed,
      roles,
      personalInfo,
      creatorId,
      memberId,
      permanentAddress,
      parentIds,
      currentAddress,
      bankAccountDetails,
      nomineeDetails,
      mainSavingsAccount: mainSavingsAccount._id,
      shares: shares,
      accounts: [mainSavingsAccount._id],
      hasBeenActivated,
      collectionAccount: collectionAccount._id,
    };
    const result = await User.create(creationData);
    console.log("new user added");

    if (creatorId !== "superAdmin") {
      console.log("Updating coordinator portfolio...");
      const coordinator = await User.findByIdAndUpdate(creatorId, {
        $push: { subMembers: result.phoneNumber },
      });

      const incentiveTransaction = await createTransactionEntry({
        amount: 1,
        accountId: coordinator.mainSavingsAccount,
        remark: `Member Creation Incentive ${phoneNumber}`,
        kind: "credit",
        breakDown: [],
        source: "Society",
        method: "internal",
        proof: "N/A",
      });

      console.log("Done", incentiveTransaction);
    }

    await Sequence.findOneAndUpdate(
      { name: "member" },
      { value: memberId + 1 }
    );
    console.log("Member sequence updated");
    await Sequence.findOneAndUpdate(
      { name: "shares" },
      { value: newShareNumber + 1 }
    );
    console.log("Shares sequence updated");
    res.status(200).json({ result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const updateMember = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const { data } = req.body;
    console.log("updating user", phoneNumber);
    const user = await User.findById(phoneNumber);

    if (user === null) {
      res.status(400).json("Member not found.");
      return;
    }
    console.log(data);

    await updateAccount(user.mainSavingsAccount, { isActive: true });
    const updatedUser = await User.findByIdAndUpdate(phoneNumber, {
      ...data,
    });
    console.log("user updated");
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const makeCoordinator = async (req, res) => {
  try {
    const { phoneNumber, converterId } = req.body;
    console.log(`Make coordinator ${phoneNumber} by ${converterId}`);
    const user = await User.findById(phoneNumber);

    if (user === null) {
      res.status(400).json("Member not found.");
      return;
    }

    if (!user.hasBeenActivated) {
      res.status(400).json("Member has not been activated. ");
      return;
    }

    await updateAccount(user.collectionAccount, { isActive: true });
    const updatedUser = await User.findByIdAndUpdate(phoneNumber, {
      coordinatorId: `C${user.memberId}`,
      roles: [...user.roles, "coordinator"],
      converterId,
      isCoordinator: true,
      subMembers: [],
      subAccounts: [],
    });
    console.log(phoneNumber, "made coordinator");
    res.status(200).json(updatedUser);
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export const getCoordinators = async (req, res) => {
  try {
    const coordinators = await User.find({ isCoordinator: true });
    console.log(coordinators);
    res.status(200).json(coordinators);
  } catch (error) {
    res.json(500).json({ message: error });
  }
};

export const getCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Sending coordinator");
    const coordinator = await User.findById(id);
    console.log(coordinator);
    if (coordinator === null || !coordinator.isCoordinator) {
      res.status(400).json({ message: "Coordinator not found." });
      return;
    }
    res.status(200).json(coordinator);
  } catch (error) {
    res.json(500).json({ message: error });
  }
};

export const signin = async (req, res) => {
  const { phoneNumber, password } = req.body;
  console.log("loginRequest", phoneNumber);

  try {
    const existingUser = await User.findOne({ phoneNumber });

    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist. " });
    }
    console.log("Sending login...", existingUser);

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      console.log("incorrect password");
      return res.status(400).json({ message: "Invalid credentials. " });
    }

    const token = jwt.sign(
      { phoneNumber: existingUser.phoneNumber, id: existingUser._id },
      "test",
      { expiresIn: "30d" }
    );
    existingUser.password = "no, lol";
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};
