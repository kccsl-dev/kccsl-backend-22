import express from "express";
import { makeTransaction } from "../controllers/transaction";

const router = express.Router();

router.post("/", makeTransaction);

export default router;
