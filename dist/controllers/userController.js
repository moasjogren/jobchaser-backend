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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserAccount = void 0;
exports.createUser = createUser;
exports.signInUser = signInUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const SALT_ROUNDS = 10;
// Create token
const createJWT = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
};
// Create user
function createUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, email, password } = req.body;
        try {
            const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
            const user = yield db_1.prisma.user.create({
                data: {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashedPassword,
                },
            });
            res.status(201).json({ message: `User created ${user.id} ${user.email}` });
        }
        catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
}
// Log in user
function signInUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield db_1.prisma.user.findUnique({
                where: { email: email },
            });
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const validPassword = yield bcrypt_1.default.compare(password, user.password);
            if (user && validPassword) {
                const token = createJWT(user);
                res.status(200).json({
                    token,
                    user: user,
                });
            }
            else {
                res.status(401).json("Invalid username or password");
            }
        }
        catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    });
}
// Read one user
const getUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const protectedReq = req;
    const userId = (_a = protectedReq.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ message: "No user ID" });
        return;
    }
    try {
        const user = yield db_1.prisma.user.findUnique({
            where: { id: userId },
        });
        res.status(200).json({ user });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUserAccount = getUserAccount;
// Update user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const protectedReq = req;
    const userId = (_a = protectedReq.user) === null || _a === void 0 ? void 0 : _a.id;
    const { firstName, lastName, bio, status } = req.body;
    try {
        const updatedUser = yield db_1.prisma.user.update({
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
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update user account" });
    }
});
exports.updateUser = updateUser;
// Delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const protectedReq = req;
    const userId = (_a = protectedReq.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const deletedUser = yield db_1.prisma.user.delete({
            where: {
                id: userId,
            },
        });
        res.status(200).json({ message: "Deleted user", deletedUser });
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(500).json({ error: "Failed to delete user account", details: errorMessage });
    }
});
exports.deleteUser = deleteUser;
