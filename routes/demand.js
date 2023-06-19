import express from "express";
import {
  getDemand,
  getDemands,
  getDemandsByDate,
  getReportByDate,
  getTodayDemands,
  makeDemand,
} from "../controllers/demand";

const router = express.Router();

router.get("/", getDemands);
router.get("/byDate/:from/:to", getDemandsByDate);
router.get("/userReport/:from/:to", getReportByDate);
router.get("/today", getTodayDemands);
router.get("/:id", getDemand);
router.post("/", makeDemand);

export default router;
