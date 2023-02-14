import mongoose from "mongoose";
import Sequence from "../models/sequence.js";
import Interest from "../models/interest.js";
import { generateInterestDoc } from "./generateInterest.js";

export const GenerateDBs = () => {
  const sequence = {
    member: 1000000001,
    RDS: 1000000001,
    RDM: 1000000001,
    RDL: 1000000001,
    FDS: 1000000001,
    FDM: 1000000001,
    FDL: 1000000001,
    FIXED: 1000000001,
    FLEX: 1000000001,
    shares: 1,
    shareReceipt: 1000001,
  };
  return new Promise(async (resolve, reject) => {
    const numberOfDocs = await Sequence.count();
    console.log(numberOfDocs, " sequences present in sequence. ");
    if (numberOfDocs === 0) {
      console.log("Creating sequqnces...");
      await Sequence.create(sequence);
    } else {
      console.log("Not creating documents...");
    }
    const numberOfInterests = await Interest.count();
    console.log(numberOfInterests, " interests present");
    if (numberOfInterests === 0) {
      const interestDoc = generateInterestDoc(6.25);
      console.log("Creating interest...");
      await Interest.create({ ...interestDoc, applicableFrom: new Date() });
    } else {
      console.log("Not creating documents...");
    }
    resolve();
  });
};

export const SequenceId = Sequence.find()[0];
