import express from "express";
import {
  checkId,
  makeCoordinator,
  createUser,
  getUser,
  getUsers,
  signin,
  updateMember,
  getCoordinators,
  getCoordinator,
  resetPassword,
  checkOldMember,
  getUserByMid,
  updateOldMember,
} from "../controllers/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/member/:id", getUser);
router.get("/checkid/:id", checkId);
router.get("/getByMid/:mid", getUserByMid);
router.get("/checkOldMember/:memberId", checkOldMember);
router.get("/coordinators", getCoordinators);
router.get("/coordinator/:id", getCoordinator);
router.post("/create", createUser);
router.post("/signin", signin);
router.post("/makeCoordinator", makeCoordinator);
router.post("/updateOldMember", updateOldMember);
router.post("/updateMember", updateMember);
router.post("/resetPassword", resetPassword);

export default router;
