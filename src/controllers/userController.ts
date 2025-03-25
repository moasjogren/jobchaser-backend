import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";
import { Request, Response } from "express";
import { User } from "@prisma/client";

const SALT_ROUNDS = 10;

// Create token
const createJWT = (user: User): string => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

// Create user
export async function createUser(req: Request, res: Response) {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: `User created ${user.id} ${user.email}` });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Log in user
export async function signInUser(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (user && validPassword) {
      const token = createJWT(user);

      res.status(200).json({
        token,
        user: user,
      });
    } else {
      res.status(401).json("Invalid username or password");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// Read one user
export const getUserAccount = async (req: Request, res: Response) => {
  const protectedReq = req as any;
  const userId = protectedReq.user?.id;

  if (!userId) {
    res.status(401).json({ message: "No user ID" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  const protectedReq = req as any;
  const userId = protectedReq.user?.id;
  const { firstName, lastName, bio, status } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        bio: bio,
        status: status,
      },
    });
    res.status(200).json({ message: "Updated user", updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user account" });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const protectedReq = req as any;
  const userId = protectedReq.user?.id;

  try {
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    res.status(200).json({ message: "Deleted user", deletedUser });
  } catch (error) {
    const errorMessage = (error as Error).message;
    res.status(500).json({ error: "Failed to delete user account", details: errorMessage });
  }
};
