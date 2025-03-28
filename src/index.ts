import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT);

// Middleware
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: "healthy",
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server closed");
  });
});
