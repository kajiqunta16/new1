"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const user_controller_1 = require("../controller/user-controller");
const router = (0, express_1.Router)();
// User registration
router.post("/register", user_controller_1.register);
// User login
router.post("/login", user_controller_1.login);
// Get user profile (uses JWT, no need for :userId param)
router.get("/profile", auth_1.default, user_controller_1.getUserProfile);
// Update user profile
router.put("/profile", auth_1.default, user_controller_1.updateUserProfile);
// Delete user account
router.delete("/profile", auth_1.default, user_controller_1.deleteUserAccount);
// Change user password
router.put("/profile/change-password", auth_1.default, user_controller_1.changeUserPassword);
exports.default = router;
