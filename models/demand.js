import mongoose, { Schema } from "mongoose";

const demandSchema = new Schema(
  {
    accountNumber: { type: String, required: true },
    accountId: { type: String, required: true },
    amount: { type: Number, required: true },
    membedId: { type: String, required: true },
    withdrawerCoordinatorId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Demand", demandSchema);
