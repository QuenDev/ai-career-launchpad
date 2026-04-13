import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { getProfile, updateProfile } from "../controllers/profileController";

const router = Router();

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);

export default router;
