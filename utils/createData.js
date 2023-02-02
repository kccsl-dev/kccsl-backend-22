import mongoose from "mongoose";
import Sequence from "../models/sequence.js";
import Interest from "../models/interest.js";
import { generateInterestDoc } from "./generateInterest.js";

export const GenerateDBs = () => {
  const sequences = [
    {
      name: "member",
      value: 1000000001,
    },
    {
      name: "rds",
      value: 1000000001,
    },
    {
      name: "rdm",
      value: 1000000001,
    },
    {
      name: "rdl",
      value: 1000000001,
    },
    {
      name: "fds",
      value: 1000000001,
    },
    {
      name: "fdm",
      value: 1000000001,
    },
    {
      name: "fdl",
      value: 1000000001,
    },
    {
      name: "rds",
      value: 1000000001,
    },
    {
      name: "rdm",
      value: 1000000001,
    },
    {
      name: "fix",
      value: 1000000001,
    },
    {
      name: "rds",
      value: 1000000001,
    },
    {
      name: "rdm",
      value: 1000000001,
    },
    {
      name: "flex",
      value: 1000000001,
    },
    {
      name: "shares",
      value: 1,
    },
  ];
  return new Promise(async (resolve, reject) => {
    const numberOfDocs = await Sequence.count();
    console.log(numberOfDocs, " sequences present in sequence. ");
    if (numberOfDocs === 0) {
      console.log("Creating sequqnces...");
      await Sequence.insertMany(sequences);
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
