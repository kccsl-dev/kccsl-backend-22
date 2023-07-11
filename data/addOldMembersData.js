import OldMember from "../models/oldMember.js";
import Fs from "fs";
import Readline from "readline";
import Transaction from "../models/transaction.js";

export const WriteOldMembersData = async () => {
  const fileStream = Fs.createReadStream("./data/old_members_data.csv");
  const lineReader = Readline.createInterface({
    input: fileStream,
    terminal: false,
  });

  const docs = [];
  let counter = 0;
  const done = new Set();
  const duplicate = [];
  lineReader.on("line", (line) => {
    const lineData = line.split(",");
    if (!done.has(lineData[0])) {
      done.add(lineData[0]);
      const data = {
        _id: lineData[0],
        memberId: lineData[0],
        name: lineData[1],
      };
      docs.push(data);
    } else {
      duplicate.push(lineData[0]);
    }
  });

  lineReader.on("close", async () => {
    // console.log(docs.length);
    // console.log(duplicate);
    console.log("Creating old members data");
    await OldMember.insertMany(docs);
    console.log("Old Members Data Created");
  });
};

export const deleteTransactions = () => {
  try {
    const fileStream = Fs.createReadStream("./data/transactions_to_delete.csv");
    const lineReader = Readline.createInterface({
      input: fileStream,
      terminal: false,
    });

    const docs = [];
    lineReader.on("line", (line) => {
      docs.push(line);
    });

    lineReader.on("close", async () => {
      console.log("Soft deleting transactions...");
      console.log(docs);
      for (const id of docs) {
        console.log(id);
        await Transaction.findByIdAndUpdate(id, {
          isDeleted: true,
        });
      }

      console.log("Complete.");
    });
  } catch (error) {
    console.log(error);
  }
};
