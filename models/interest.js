import mongoose, { Schema } from "mongoose";

const interestSchema = new Schema(
  {
    applicableFrom: { type: Date, required: true },
    baseRate: { type: Number, reqruied: true },

    s: { type: Number, reqruied: true },

    rds12: { type: Number, reqruied: true },
    rds24: { type: Number, reqruied: true },
    rdm36: { type: Number, reqruied: true },
    rdm48: { type: Number, reqruied: true },
    rdl60: { type: Number, reqruied: true },
    rdl72: { type: Number, reqruied: true },

    fds12: { type: Number, reqruied: true },
    fds24: { type: Number, reqruied: true },
    fdm36: { type: Number, reqruied: true },
    fdm48: { type: Number, reqruied: true },
    fdl60: { type: Number, reqruied: true },
    fdl72: { type: Number, reqruied: true },
  },
  { timestamps: true }
);

export default mongoose.model("Interest", interestSchema);
