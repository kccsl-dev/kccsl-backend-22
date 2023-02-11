import mongoose, { Schema } from "mongoose";

const interestSchema = new Schema(
  {
    applicableFrom: { type: Date, required: true },
    baseRate: { type: Number, reqruied: true },

    S: { type: Number, reqruied: true },

    RDS12: { type: Number, reqruied: true },
    RDS24: { type: Number, reqruied: true },
    RDM36: { type: Number, reqruied: true },
    RDM48: { type: Number, reqruied: true },
    RDL60: { type: Number, reqruied: true },
    RDL72: { type: Number, reqruied: true },

    FDS12: { type: Number, reqruied: true },
    FDS24: { type: Number, reqruied: true },
    FDM36: { type: Number, reqruied: true },
    FDM48: { type: Number, reqruied: true },
    FDL60: { type: Number, reqruied: true },
    FDL72: { type: Number, reqruied: true },
  },
  { timestamps: true }
);

export default mongoose.model("Interest", interestSchema);
