import express from "express";
import { makeTransaction } from "../controllers/transaction.js";

const router = express.Router();

router.post("/", makeTransaction);

export default router;
