"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const checkExistingUser_1 = require("../middleware/checkExistingUser");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Routes – table User
router.post("/sign-up", checkExistingUser_1.checkExistingUser, userController_1.createUser);
router.post("/sign-in", userController_1.signInUser);
router.get("/account/:userId", auth_1.authMiddleware, userController_1.getUserAccount);
router.put("/account/:userId", auth_1.authMiddleware, userController_1.updateUser);
router.delete("/account/:userId", auth_1.authMiddleware, userController_1.deleteUser);
exports.default = router;
