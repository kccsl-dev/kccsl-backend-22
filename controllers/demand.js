import Demand from "../models/demand.js";

export const getDemands = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
export const getTodayDemands = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const getDemand = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export const makeDemand = async (req, res) => {
  try {
    const {
      accountNumber,
      accountId,
      amount,
      membedId,
      withdrawerCoordinatorId,
    } = req.body;
    console.log("raising payment demands");
    const newDemand = await Demand.create({
      accountNumber,
      accountId,
      amount,
      membedId,
      withdrawerCoordinatorId,
    });
    console.log("demand generated");
    res.status(200).json(newDemand);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};
