"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobController_1 = require("../controllers/jobController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Routes - relation table SavedJobs
router.get("/savedJobs", auth_1.authMiddleware, jobController_1.getSavedJobs);
router.post("/savedJob", auth_1.authMiddleware, jobController_1.addSavedJob);
router.delete("/savedJob", auth_1.authMiddleware, jobController_1.deleteSavedJob);
// Routes – table Job
router.post("/", auth_1.authMiddleware, jobController_1.createJob);
router.get("/", auth_1.authMiddleware, jobController_1.getJobs);
router.get("/:jobId", auth_1.authMiddleware, jobController_1.getJob);
router.put("/:jobId", auth_1.authMiddleware, jobController_1.updateJob);
router.delete("/:jobId", auth_1.authMiddleware, jobController_1.deleteJob);
exports.default = router;
