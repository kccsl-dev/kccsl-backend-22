import mongoose, { Schema } from "mongoose";

const depositSchema = new Schema(
  {
    coordinatorId: { type: String, requried: true },
    coordinatorName: { type: String, requried: true },
    dateRaised: { type: Date, requried: true },
    amount: { type: Number, required: true },
    paymentType: {
      type: String,
      requried: true,
      enum: ["cheque", "CHEQUE", "cash", "CASH", "upi", "UPI"],
    },
    proof: { type: String, requried: true },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "DENIED"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Deposit", depositSchema);
