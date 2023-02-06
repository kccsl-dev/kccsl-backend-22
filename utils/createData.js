import mongoose from "mongoose";
import Sequence from "../models/sequence.js";
import Interest from "../models/interest.js";
import { generateInterestDoc } from "./generateInterest.js";

export const GenerateDBs = () => {
  const sequence = {
    member: 1000000001,
    rds: 1000000001,
    rdm: 1000000001,
    rdl: 1000000001,
    fds: 1000000001,
    fdm: 1000000001,
    fdl: 1000000001,
    rds: 1000000001,
    rdm: 1000000001,
    fix: 1000000001,
    rds: 1000000001,
    rdm: 1000000001,
    flex: 1000000001,
    shares: 1,
    shareReceipt: 1,
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
