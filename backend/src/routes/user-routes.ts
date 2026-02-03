import { Router } from "express";
import auth from "../middleware/auth";
import {
    register,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    changeUserPassword
} from "../controller/user-controller";

const router = Router();

// User registration
router.post("/register", register);

// User login
router.post("/login", login);

// Get user profile (uses JWT, no need for :userId param)
router.get("/profile", auth, getUserProfile);

// Update user profile
router.put("/profile", auth, updateUserProfile);

// Delete user account
router.delete("/profile", auth, deleteUserAccount);

// Change user password
router.put("/profile/change-password", auth, changeUserPassword);

export default router;
