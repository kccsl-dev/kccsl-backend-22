import mongoose, { Schema } from "mongoose";

const guestSchema = new Schema(
  {
    email: { type: String, requried: true },
    phoneNumber: { type: String, requried: true },
  },
  { timestamps: true }
);

export default mongoose.model("Guest", guestSchema);
