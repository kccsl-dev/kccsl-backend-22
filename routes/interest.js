import express from "express";
import { createInterest, getCurrentInterest } from "../controllers/interest.js";

const router = express.Router();

router.get("/", getCurrentInterest);
router.post("/", createInterest);

export default router;
