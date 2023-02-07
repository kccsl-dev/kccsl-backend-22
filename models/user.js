import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema({
  addressLine1: { type: String },
  addressLine2: { type: String },
  addressLine3: { type: String },
  state: { type: String },
  district: { type: String },
  block: { type: String },
  tehsil: { type: String },
  pincode: { type: String },
});

const personalInfoSchema = new Schema({
  selfPhoto: { type: String },
  signature: { type: String },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other", ""] },
  emailAddress: { type: String, required: true },
  maritalStatus: {
    type: String,
    enum: ["married", "unmarried", "divorced", "spouseDeceased", "other", ""],
  },
  religion: {
    type: String,
    enum: ["hindu", "muslim", "sikh", "christian", "others", ""],
  },
  aadharNumber: {
    type: String,
    // minlength: 12,
    // maxlength: 12,
  },
  aadharCardFront: { type: String },
  aadharCardBack: { type: String },
  panNumber: {
    type: String,
    // minlength: 10, maxlength: 10
  },
  panCard: { type: String },
  occupation: {
    type: String,
    eunm: [
      "student",
      "farmer",
      "private",
      "service",
      "business",
      "professional",
      "govtServices",
      "defenceServices",
      "",
    ],
  },
});

const bankDetailsSchema = new Schema({
  accountHoldersName: { type: String },
  bankName: { type: String },
  accountNumber: { type: String },
  branchAddress: { type: String },
  ifscCode: {
    type: String,
    // minlength: 11, maxlength: 11
  },
});

const nomineeDetailsSchema = new Schema({
  id: { type: String },
  name: { type: String },
  aadharNumber: {
    type: String,
    // minlength: 12, maxlength: 12
  },
  dateOfBirth: { type: Date },
  nomineeId: { type: String },
  nomineePhoneNumber: { type: String },
  nomineeAddress: { type: addressSchema },
  nomineeRelationship: { type: String },
});

const shareSchema = {
  datePurchased: { type: Date },
  noOfShares: { type: Number },
  rn: { type: String },
  isMemberCreation: { type: Boolean },
};

const userSchema = new Schema(
  {
    _id: String,
    phoneNumber: {
      type: String,
      required: true,
      minlength: "10",
      maxlength: "13",
    },
    password: { type: String, required: true },
    roles: {
      type: [String],
      required: true,
    },
    creatorId: { type: String, required: true },
    memberId: { type: String, required: true, minlength: 10, maxlength: 10 },
    coordinatorId: {
      type: String,
      minlength: 11,
      maxlength: 11,
    },
    parentIds: { type: [String], reqruied: true },
    personalInfo: { type: personalInfoSchema },
    permanentAddress: { type: addressSchema },
    currentAddress: { type: addressSchema },
    bankAccountDetails: { type: bankDetailsSchema },
    nomineeDetails: { type: [nomineeDetailsSchema] },
    mainSavingsAccount: { type: String, required: true },
    hasBeenActivated: { type: Boolean, required: true },
    shares: { type: [String], required: true },
    shareDetails: { type: [shareSchema] },
    isOTPVerified: { type: Boolean, required: true },
    isPasswordReset: { type: Boolean },
    accounts: { type: [String] },
    collectionAccount: { type: String, requried: true },
    isCoordinator: { type: Boolean },
    converterId: { type: String },
    conversionDate: { type: Date },
    subMembers: { type: [String] },
    subAccounts: { type: [String] },
    totalIncentive: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
