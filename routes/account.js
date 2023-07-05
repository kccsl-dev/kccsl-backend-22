import express from "express";
import {
  acceptGuarentee,
  addGuarenter,
  approveLoan,
  buyShares,
  createLoan,
  createNewAccount,
  denyGuarentee,
  denyLoan,
  getCoordinatorPendingLoans,
  getGuarenters,
  getLoanGuarenters,
  getMemberAccount,
  getMemberAccounts,
  updateAccount,
} from "../controllers/account.js";

const router = express.Router();

router.get("/:id", getMemberAccounts);
router.get("/account/:id", getMemberAccount);
router.post("/", createNewAccount);
router.get("/loan/:id", getCoordinatorPendingLoans);
router.post("/loan", createLoan);
router.post("/loan/deny", denyLoan);
router.post("/loan/addGuarenter", addGuarenter);
router.get("/loan/:loanId/guarenters", getLoanGuarenters);
router.get("/guarenter/:userId", getGuarenters);

router.post("/guarentee/approve", acceptGuarentee);
router.post("/guarentee/deny", denyGuarentee);

router.post("/loan/approve", approveLoan);
router.post("/shares", buyShares);

router.patch("/", updateAccount);

export default router;
