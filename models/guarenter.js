import mongoose, { Schema } from "mongoose";

const userDetailsSchema = new Schema({
  id: { type: String, reqruied: true },
  memberId: { type: String, reqruied: true },
  name: { type: String, reqruied: true },
});

export const guarenterSchema = new Schema(
  {
    guarenterDetails: {
      type: userDetailsSchema,
      reqruied: true,
    },
    borrowerDetails: {
      type: userDetailsSchema,
      reqrueid: true,
    },
    coordinatorDetails: {
      type: userDetailsSchema,
      reqrueid: true,
    },
    loanId: { type: String, requried: true },
    amount: { type: String, reqruied: true },
    status: {
      type: String,
      reqruied: true,
      enum: ["PENDING", "APPROVED", "DENIED"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Guarenter", guarenterSchema);
