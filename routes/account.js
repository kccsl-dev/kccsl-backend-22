import express from "express";
import {
  buyShares,
  createNewAccount,
  getMemberAccount,
  getMemberAccounts,
} from "../controllers/account";

const router = express.Router();

router.get("/:id", getMemberAccounts);
router.get("/account/:id", getMemberAccount);
router.post("/", createNewAccount);
router.post("/shares", buyShares);

export default router;
