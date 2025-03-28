import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import jobRoutes from "./routes/jobRoutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);
app.use("/jobs", jobRoutes);

app.get("/", (req, res) => {
  res.send(`Server JobChaser. On port: ${port}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
