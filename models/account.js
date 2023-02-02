import mongoose, { Schema } from "mongoose";
import { transactionSchema } from "./transaction";

const personalInfoSchema = new Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other", ""] },
  emailAddress: { type: String, required: true },
  aadharNumber: {
    type: String,
    requried: false,
    minlength: 12,
    maxlength: 12,
  },
  panNumber: { type: String, reqruied: false, minlength: 10, maxlength: 10 },
});

const AccountSchema = new Schema(
  {
    accountHolderDetails: { type: personalInfoSchema, required: true },
    accountNumber: { type: String, required: true },
    userId: { type: String, requried: true },
    type: {
      type: String,
      required: true,
      enum: ["s", "rds", "rdm", "rdl", "fds", "fdm", "fdl", "fix", "flex", "c"],
    },
    credits: { type: [transactionSchema], required: true },
    debits: { type: [transactionSchema], required: true },
    creatorId: { type: String, required: true },
    initalAmount: { type: Number },
    balance: { type: Number, reqruied: true },
    matureAmount: { type: Number },
    matureDate: { type: Date },
    interestApplicable: {
      type: [String],
      reqruied: true,
    },
    isActive: { type: Boolean, requried: true },
  },
  { timeseries: true }
);

export default mongoose.model("Account", AccountSchema);
