import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import { authMiddleware } from "./middleware/authMiddleware";
import analyzeRoutes from "./routes/analyze";
import historyRoutes from "./routes/history";

dotenv.config(); // loads .env variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());           // allow frontend requests
app.use(express.json());   // parse JSON request bodies

// Auth routes 
app.use("/auth", authRoutes);

//Test protecterd route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({message: "You are authorized!"});
});

//Analyze Routes
app.use("/analyze" , analyzeRoutes);

//History Routes
app.use("/history", historyRoutes);

app.get("/", (req, res) => {
  res.send("AI Career Launchpad API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});