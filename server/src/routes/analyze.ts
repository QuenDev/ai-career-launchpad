import { Router } from "express";
import { analyzeResume } from "../controllers/analyzeController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authMiddleware, analyzeResume);

export default router;