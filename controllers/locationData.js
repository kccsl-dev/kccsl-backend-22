import { states, districts } from "../data/location.js";

export const getStates = async (req, res) => {
  try {
    res.status(200).json(states);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

export const getDistricts = async (req, res) => {
  try {
    const state = req.params.state;
    const stateDistricts = districts[state];
    res.status(200).json(stateDistricts);
  } catch (error) {
    res.status(404).json({ message: error });
  }
};
