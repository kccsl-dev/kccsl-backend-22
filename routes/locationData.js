import express from "express";
import { getDistricts, getStates } from "../controllers/locationData.js";

const router = express.Router();

router.get("/states", getStates);
router.get("/districts/:state", getDistricts);

export default router;
