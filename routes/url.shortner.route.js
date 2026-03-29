import { Router } from "express";
import { createUrl,getAllUrl,redirecttoUrl} from "../controllers/url.shortner.js";

const router=Router();
router.route("/").post(createUrl).get(getAllUrl)
router.route("/:shortId").get(redirecttoUrl)
export const urlRouter=router
