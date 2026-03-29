import express from "express"
import { urlRouter } from "./routes/url.shortner.route.js";
const app = express();
app.use(express.json())
app.use("/api/v1",urlRouter)
export {app}