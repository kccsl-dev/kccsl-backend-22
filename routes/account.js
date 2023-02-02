import express from "express";
import { createNewAccount, getMemberAccounts } from "../controllers/account";

const router = express.Router();

router.get("/:id", getMemberAccounts);
router.post("/create", createNewAccount);

export default router;
