"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/users", userRoutes_1.default);
app.use("/jobs", jobRoutes_1.default);
app.get("/", (req, res) => {
    res.send(`Server JobChaser. On port: ${port}`);
});
app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});
