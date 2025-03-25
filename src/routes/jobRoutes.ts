import express from "express";
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob,
  getSavedJobs,
  addSavedJob,
  deleteSavedJob,
} from "../controllers/jobController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();
// Routes - relation table SavedJobs
router.get("/savedJobs", authMiddleware, getSavedJobs);
router.post("/savedJob", authMiddleware, addSavedJob);
router.delete("/savedJob", authMiddleware, deleteSavedJob);

// Routes – table Job
router.post("/", authMiddleware, createJob);
router.get("/", authMiddleware, getJobs);
router.get("/:jobId", authMiddleware, getJob);
router.put("/:jobId", authMiddleware, updateJob);
router.delete("/:jobId", authMiddleware, deleteJob);

export default router;
