import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user-model";

/* =====================
   Register User
===================== */

interface TokenPayload {
    id: string;
}
export const register = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (!username || !email || !password || !confirmPassword) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ error: "Passwords do not match" });
            return;
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            res.status(409).json({ error: "User already exists" });
            return;
        }

        const user = new User({
            username,
            email,
            password // hashed by pre('save')
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Server error"
        });
    }
};

/* =====================
   Login User
===================== */

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ error: "Email and password required" });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const token = jwt.sign(
            { id: user._id.toString() } as TokenPayload,
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Server error"
        });
    }
};

/* =====================
   Get User Profile
===================== */

export const getUserProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = await User.findById(req.params.userId).select("-password");

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Invalid user ID"
        });
    }
};

/* =====================
   Update User Profile
===================== */

export const updateUserProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Update failed"
        });
    }
};

/* =====================
   Delete User
===================== */

export const deleteUserAccount = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);

        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Delete failed"
        });
    }
};

/* =====================
   Change Password
===================== */

export const changeUserPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(req.params.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid old password" });
            return;
        }

        user.password = newPassword; // hashed by pre('save')
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Password change failed"
        });
    }
};
