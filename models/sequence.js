import mongoose, { Schema } from "mongoose";

const sequenceSchema = new Schema(
  {
    name: { type: String, reqruied: true },
    value: { type: Number, requried: true },
  },
  { timestamps: true }
);

export default mongoose.model("Sequence", sequenceSchema);
