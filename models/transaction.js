import mongoose, { Schema } from "mongoose";

export const transactionSchema = new Schema(
  {
    amount: { type: Number, reqruied: true },
    accountId: { type: String, requried: true },
    source: { type: String, reqruied: true },
    remark: { type: String, reqruied: true },
    kind: { type: String, reqruied: true, enum: ["credit", "debit"] },
    method: {
      type: String,
      reqruied: true,
      enum: ["cash", "cheque", "UPI", "internal"],
    },
    proof: { type: String, required: true },
    breakdown: { type: [Object] },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
