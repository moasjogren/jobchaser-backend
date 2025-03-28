"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    var _a;
    const bearerToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!bearerToken) {
        res.status(401).json({ message: "Unauthorized, no token" });
        return;
    }
    if (!process.env.JWT_SECRET) {
        res.status(500).json({ message: "JWT SECTRET is not defined" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401).json({ message: "Unauthorized, invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
