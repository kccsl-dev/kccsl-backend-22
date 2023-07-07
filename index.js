import express from "express";
import bodypParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/user.js";
import locationRouter from "./routes/locationData.js";
import transactionRouter from "./routes/transaction.js";
import accountRouter from "./routes/account.js";
import interestRouter from "./routes/interest.js";
import demandRouter from "./routes/demand.js";
import depositRouter from "./routes/deposit.js";
import { GenerateDBs } from "./utils/createData.js";
import * as dotenv from "dotenv";
import { SequenceId } from "./utils/createData.js";
import { WriteOldMembersData } from "./data/addOldMembersData.js";
dotenv.config();
const app = express();

app.use(bodypParser.json({ limit: "30mb", extender: true }));
app.use(bodypParser.urlencoded({ limit: "30mb", extender: true }));
app.use(cors());

app.use("/user", userRouter);
app.use("/location", locationRouter);
app.use("/account", accountRouter);
app.use("/transaction", transactionRouter);
app.use("/interest", interestRouter);
app.use("/demand", demandRouter);
app.use("/deposit", depositRouter);

const databaseURI = process.env.DATABASE_URI;
const PORT = process.env.PORT;
console.log(`Starting server on ${PORT}`);

mongoose
  .connect(databaseURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    GenerateDBs()
      .then(() => {
        app.listen(PORT, () => console.log(`Server running: ${PORT}`));
        WriteOldMembersData();
      })
      .catch((error) => console.log(27, error.message));
  })
  .catch((error) => console.log(error.message));
