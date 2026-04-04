import { Router } from "express";
import { saveAnalysis, getHistory } from "../controllers/historyController";
import { authMiddleware} from "../middleware/authMiddleware";

const router = Router();

router.post("/save", authMiddleware, saveAnalysis);
router.get("/", authMiddleware, getHistory);

export default router;