import express from "express";
import {
  createUser,
  signInUser,
  getUserAccount,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { checkExistingUser } from "../middleware/checkExistingUser";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// Routes – table User
router.post("/sign-up", checkExistingUser, createUser);
router.post("/sign-in", signInUser);
router.get("/account/:userId", authMiddleware, getUserAccount);
router.put("/account/:userId", authMiddleware, updateUser);
router.delete("/account/:userId", authMiddleware, deleteUser);
export default router;
