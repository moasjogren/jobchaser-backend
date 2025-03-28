"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSavedJob = exports.addSavedJob = exports.deleteJob = exports.updateJob = void 0;
exports.createJob = createJob;
exports.getJobs = getJobs;
exports.getJob = getJob;
exports.getSavedJobs = getSavedJobs;
const db_1 = require("../config/db");
// Create Job
function createJob(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { company, position, role, level, contract, location, languages } = req.body;
        try {
            const job = yield db_1.prisma.job.create({
                data: {
                    company,
                    position,
                    role,
                    level,
                    contract,
                    location,
                    languages,
                },
            });
            res.status(201).json({ message: `Job created`, job });
        }
        catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
}
// Read many Jobs
function getJobs(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const jobs = yield db_1.prisma.job.findMany();
            res.status(200).json({ jobs });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch jobs" });
        }
    });
}
// Read one Job
function getJob(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { jobId } = req.params;
        try {
            const job = yield db_1.prisma.job.findUnique({
                where: {
                    id: Number(jobId),
                },
            });
            res.status(200).json({ job });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch job" });
        }
    });
}
// Update Job
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    const { company, position, role, level, contract, location, languages } = req.body;
    if (!jobId) {
        res.status(400).json({ error: "Missing required id" });
        return;
    }
    try {
        const updatedJob = yield db_1.prisma.job.update({
            where: {
                id: Number(jobId),
            },
            data: {
                company,
                position,
                role,
                level,
                contract,
                location,
                languages,
            },
        });
        res.status(200).json({ message: "Updated job", updatedJob });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update job" });
    }
});
exports.updateJob = updateJob;
// Delete Job
const deleteJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId } = req.params;
    try {
        const deletedJob = yield db_1.prisma.job.delete({
            where: {
                id: Number(jobId),
            },
        });
        res.status(200).json({ message: "Deleted job", deletedJob });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).json({ error: "Failed to delete job", details: errorMessage });
    }
});
exports.deleteJob = deleteJob;
// ------------------ Relation table SavedJobs ------------------
// Create SavedJob
const addSavedJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId, userId } = req.body;
    if (!jobId || !userId) {
        res.status(400).json({ error: "Missing required id:s" });
        return;
    }
    try {
        const savedJob = yield db_1.prisma.savedJob.create({
            data: {
                userId: userId,
                jobId: jobId,
            },
        });
        res.status(200).json({ message: "Saved job", savedJob });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to save job" });
    }
});
exports.addSavedJob = addSavedJob;
// Read many SavedJob - one user
function getSavedJobs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const protectedReq = req;
        const userId = (_a = protectedReq.user) === null || _a === void 0 ? void 0 : _a.id;
        try {
            const savedJobs = yield db_1.prisma.savedJob.findMany({
                where: {
                    userId: userId,
                },
            });
            res.status(200).json({ savedJobs });
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch saved jobs" });
        }
    });
}
// Delete SavedJob
const deleteSavedJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { jobId, userId } = req.body;
    if (!jobId || !userId) {
        res.status(400).json({ error: "Missing required id:s" });
        return;
    }
    try {
        const deletedSavedJob = yield db_1.prisma.savedJob.delete({
            where: {
                userId_jobId: {
                    userId: userId,
                    jobId: jobId,
                },
            },
        });
        res.status(200).json({ message: "Deleted saved job", deletedSavedJob });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to save job" });
    }
});
exports.deleteSavedJob = deleteSavedJob;
