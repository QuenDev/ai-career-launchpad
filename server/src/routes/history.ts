import { Router } from "express";
import { saveAnalysis, getHistory, deleteAnalysis } from "../controllers/historyController";
import { authMiddleware} from "../middleware/authMiddleware";

const router = Router();

router.post("/save", authMiddleware, saveAnalysis);
router.get("/", authMiddleware, getHistory);
router.delete("/:id", authMiddleware, deleteAnalysis);

export default router;