import express from "express";
import {
  approveLoan,
  buyShares,
  createLoan,
  createNewAccount,
  denyLoan,
  getCoordinatorPendingLoans,
  getMemberAccount,
  getMemberAccounts,
  updateAccount,
} from "../controllers/account";

const router = express.Router();

router.get("/:id", getMemberAccounts);
router.get("/account/:id", getMemberAccount);
router.post("/", createNewAccount);
router.get("/loan/:id", getCoordinatorPendingLoans);
router.post("/loan", createLoan);
router.post("/loan/deny", denyLoan);
router.post("/loan/approve", approveLoan);
router.post("/shares", buyShares);

router.patch("/", updateAccount);

export default router;
