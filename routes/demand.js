import express from "express";
import {
  getDemand,
  getDemands,
  getTodayDemands,
  makeDemand,
} from "../controllers/demand";

const router = express.Router();

router.get("/", getDemands);
router.get("/today", getTodayDemands);
router.get("/:id", getDemand);
router.post("/", makeDemand);

export default router;
