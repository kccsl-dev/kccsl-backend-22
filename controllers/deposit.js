import Deposit from "../models/deposit";

export const getDeposits = async (req, res) => {
  try {
    console.log("fetching all deposits");
    const deposits = await Deposit.find().sort({ createdAt: -1 });
    res.status(200).json(deposits);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const getCoordinatorDeposits = async (req, res) => {
  try {
    const { coordinatorId } = req.params;
    console.log(`fetching coordinator deposits ${coordinatorId}`);
    const deposits = await Deposit.find({ coordinatorId: coordinatorId });
    res.status(200).json(deposits);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const createDeposit = async (req, res) => {
  try {
    const { coordinatorId, coordinatorName, amount, paymentType, proof } =
      req.body;
    console.log("creating deposit request");
    const newDeposit = await Deposit.create({
      coordinatorId,
      coordinatorName,
      dateRaised: new Date(),
      amount,
      paymentType,
      proof,
      status: "PENDING",
    });
    console.log("deposit generated");
    res.status(200).json(newDeposit);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const approveDeposit = async (req, res) => {
  try {
    const { depositId } = req.body;
    console.log(depositId);
    console.log("approving deposit");
    const updatedDeposit = await Deposit.findByIdAndUpdate(depositId, {
      status: "APPROVED",
    });
    console.log("deposit approved");
    res.status(200).json(updatedDeposit);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
export const denyDeposit = async (req, res) => {
  try {
    const { depositId } = req.body;
    console.log("deying deposit");
    const updatedDeposit = await Deposit.findByIdAndUpdate(depositId, {
      status: "DENIED",
    });
    console.log("deposit denied");
    res.status(200).json(updatedDeposit);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
