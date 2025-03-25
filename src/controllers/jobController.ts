import { prisma } from "../config/db";
import { Request, Response } from "express";

// Create Job
export async function createJob(req: Request, res: Response) {
  const { company, position, role, level, contract, location, languages } = req.body;

  try {
    const job = await prisma.job.create({
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
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Read many Jobs
export async function getJobs(_req: Request, res: Response) {
  try {
    const jobs = await prisma.job.findMany();
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
}

// Read one Job
export async function getJob(req: Request, res: Response) {
  const { jobId } = req.params;
  try {
    const job = await prisma.job.findUnique({
      where: {
        id: Number(jobId),
      },
    });
    res.status(200).json({ job });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch job" });
  }
}

// Update Job
export const updateJob = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const { company, position, role, level, contract, location, languages } = req.body;

  if (!jobId) {
    res.status(400).json({ error: "Missing required id" });
    return;
  }

  try {
    const updatedJob = await prisma.job.update({
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
  } catch (error) {
    res.status(500).json({ error: "Failed to update job" });
  }
};

// Delete Job
export const deleteJob = async (req: Request, res: Response) => {
  const { jobId } = req.params;

  try {
    const deletedJob = await prisma.job.delete({
      where: {
        id: Number(jobId),
      },
    });
    res.status(200).json({ message: "Deleted job", deletedJob });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ error: "Failed to delete job", details: errorMessage });
  }
};

// ------------------ Relation table SavedJobs ------------------

// Create SavedJob
export const addSavedJob = async (req: Request, res: Response) => {
  const { jobId, userId } = req.body;

  if (!jobId || !userId) {
    res.status(400).json({ error: "Missing required id:s" });
    return;
  }

  try {
    const savedJob = await prisma.savedJob.create({
      data: {
        userId: userId,
        jobId: jobId,
      },
    });

    res.status(200).json({ message: "Saved job", savedJob });
  } catch (error) {
    res.status(500).json({ error: "Failed to save job" });
  }
};

// Read many SavedJob - one user
export async function getSavedJobs(req: Request, res: Response) {
  const protectedReq = req as any;
  const userId = protectedReq.user?.id;

  try {
    const savedJobs = await prisma.savedJob.findMany({
      where: {
        userId: userId,
      },
    });

    res.status(200).json({ savedJobs });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch saved jobs" });
  }
}

// Delete SavedJob
export const deleteSavedJob = async (req: Request, res: Response) => {
  const { jobId, userId } = req.body;

  if (!jobId || !userId) {
    res.status(400).json({ error: "Missing required id:s" });
    return;
  }

  try {
    const deletedSavedJob = await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId: userId,
          jobId: jobId,
        },
      },
    });

    res.status(200).json({ message: "Deleted saved job", deletedSavedJob });
  } catch (error) {
    res.status(500).json({ error: "Failed to save job" });
  }
};
