import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

export const checkExistingUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
