import express from "express";
import cors from "cors";
import { urlRouter } from "./routes/url.shortner.route.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", urlRouter);
export { app };