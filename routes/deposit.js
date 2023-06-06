import express from "express";
import {
  approveDeposit,
  createDeposit,
  denyDeposit,
  getCoordinatorDeposits,
  getDeposits,
} from "../controllers/deposit";

const router = express.Router();

router.get("/", getDeposits);
router.get("/:coordinatorId", getCoordinatorDeposits);
router.post("/create", createDeposit);
router.post("/approve", approveDeposit);
router.post("/deny", denyDeposit);

export default router;
