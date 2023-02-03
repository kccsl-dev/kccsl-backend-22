import mongoose, { Schema } from "mongoose";

const sequenceSchema = new Schema(
  {
    member: { type: Number, required: true },
    rds: { type: Number, required: true },
    rdm: { type: Number, required: true },
    rdl: { type: Number, required: true },
    fds: { type: Number, required: true },
    fdm: { type: Number, required: true },
    fdl: { type: Number, required: true },
    rds: { type: Number, required: true },
    rdm: { type: Number, required: true },
    fix: { type: Number, required: true },
    rds: { type: Number, required: true },
    rdm: { type: Number, required: true },
    flex: { type: Number, required: true },
    shares: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Sequence", sequenceSchema);
