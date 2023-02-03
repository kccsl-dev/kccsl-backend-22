import express from "express";
import {
  createNewAccount,
  getMemberAccount,
  getMemberAccounts,
} from "../controllers/account";

const router = express.Router();

router.get("/:id", getMemberAccounts);
router.get("/account/:id", getMemberAccount);
router.post("/", createNewAccount);

export default router;
