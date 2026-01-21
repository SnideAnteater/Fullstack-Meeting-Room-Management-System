import express from "express";
import cors from "cors";
import routes from "./routes";
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());
app.use(logger);

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

export default app;
