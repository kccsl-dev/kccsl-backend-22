import mongoose, { Schema } from "mongoose";

const oldMemberSchema = new Schema(
  {
    _id: String, //same as member id to reduce lookup times
    memberId: { type: String, requried: true },
    name: { type: String, requried: true },
  },
  { timestamps: true }
);

export default mongoose.model("OldMember", oldMemberSchema);
