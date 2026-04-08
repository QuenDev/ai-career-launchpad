import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth";
import { authMiddleware } from "./middleware/authMiddleware";
import analyzeRoutes from "./routes/analyze";
import historyRoutes from "./routes/history";

dotenv.config(); // loads .env variables

const app = express();
const PORT = process.env.PORT || 5000;

//Security Headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://ai-career-launchpad.vercel.app",
    ];
    
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());   // parse JSON request bodies

//Global rate limit
const globalLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 request per 15 mins
  message: { error: "Too many requests, please try again later."}
});

// Strict rate limit for AI route
const analyzeLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // max 10 request per hour
  message: { error: "Analysis limit reached. Please try again in an hour."}
});

app.use(globalLimit);

// Auth routes 
app.use("/auth", authRoutes);

//Analyze Routes
app.use("/analyze", analyzeLimit, analyzeRoutes);

//History Routes
app.use("/history", historyRoutes);

//Test protecterd route
app.get("/protected", authMiddleware, (req, res) => {
  res.json({message: "You are authorized!"});
});


app.get("/", (req, res) => {
  res.send("AI Career Launchpad API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});