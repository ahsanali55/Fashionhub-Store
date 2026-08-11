import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.middleware";
import cookieParser from "cookie-parser";
const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


// Routes
app.get("/", (req, res) => {
  res.send("FashionHub Api is running");
});
app.use("/api/auth", authRoutes);

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "FashionHub API Running Successfully",
  });
});

// Error Handling Middleware
app.use(errorHandler);
export default app;