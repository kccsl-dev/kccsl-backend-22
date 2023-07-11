import express from "express";
import {
  makeTransaction,
  reverseCoordinatorSecurity,
} from "../controllers/transaction.js";

const router = express.Router();

router.post("/", makeTransaction);
router.post("/reverseCoordinator", reverseCoordinatorSecurity);

export default router;
