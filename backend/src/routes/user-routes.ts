import { Router } from "express";
import auth from "../middleware/auth";
import userController from "../controller/user-controller";

const router = Router();

// User registration
router.post("/register", userController.register);

// User login
router.post("/login", userController.login);

// Get user profile
router.get("/:userId", auth, userController.getUserProfile);

// Update user profile
router.put("/:userId", auth, userController.updateUserProfile);

// Delete user account
router.delete("/:userId", auth, userController.deleteUserAccount);

// Change user password
router.put("/:userId/change-password",auth,userController.changeUserPassword);

export default router;
