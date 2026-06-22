import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { urlRouter } from "./routes/url.shortner.route.js";
const app = express();
app.use(helmet());
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api", limiter);
app.use(express.json({ limit: '10kb' }));
app.use("/api/v1", urlRouter);

export { app };