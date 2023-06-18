import mongoose, { Schema } from "mongoose";

const sequenceSchema =  new Schema(
  {
    member: { type: Number, required: true },
    RDS: { type: Number, required: true },
    RDM: { type: Number, required: true },
    RDL: { type: Number, required: true },
    FDS: { type: Number, required: true },
    FDM: { type: Number, required: true },
    FDL: { type: Number, required: true },
    FIXED: { type: Number, required: true },
    FLEX: { type: Number, required: true },
    shares: { type: Number, required: true },
    shareReceipt: { type: Number, reqruied: true },
  },
  { timestamps: true }
);

export default mongoose.model("Sequence", sequenceSchema);
