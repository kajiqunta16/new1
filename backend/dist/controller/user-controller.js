"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeUserPassword = exports.deleteUserAccount = exports.updateUserProfile = exports.getUserProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user-model"));
const register = async (req, res) => {
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
        const existingUser = await user_model_1.default.findOne({
            $or: [{ email }, { username }]
        });
        if (existingUser) {
            res.status(409).json({ error: "User already exists" });
            return;
        }
        const user = new user_model_1.default({
            username,
            email,
            password // hashed by pre('save')
        });
        await user.save();
        res.status(201).json({
            message: "User registered successfully"
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: error instanceof Error ? error.message : "Server error"
        });
    }
};
exports.register = register;
/* =====================
   Login User
===================== */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password required" });
            return;
        }
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    }
    catch (error) {
        res.status(500).json({
            error: error instanceof Error ? error.message : "Server error"
        });
    }
};
exports.login = login;
/* =====================
   Get User Profile
===================== */
const getUserProfile = async (req, res) => {
    try {
        const user = await user_model_1.default.findById(req.params.userId).select("-password");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Invalid user ID"
        });
    }
};
exports.getUserProfile = getUserProfile;
/* =====================
   Update User Profile
===================== */
const updateUserProfile = async (req, res) => {
    try {
        const user = await user_model_1.default.findByIdAndUpdate(req.params.userId, req.body, { new: true, runValidators: true }).select("-password");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Update failed"
        });
    }
};
exports.updateUserProfile = updateUserProfile;
/* =====================
   Delete User
===================== */
const deleteUserAccount = async (req, res) => {
    try {
        const user = await user_model_1.default.findByIdAndDelete(req.params.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Delete failed"
        });
    }
};
exports.deleteUserAccount = deleteUserAccount;
/* =====================
   Change Password
===================== */
const changeUserPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await user_model_1.default.findById(req.params.userId);
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
    }
    catch (error) {
        res.status(400).json({
            error: error instanceof Error ? error.message : "Password change failed"
        });
    }
};
exports.changeUserPassword = changeUserPassword;
