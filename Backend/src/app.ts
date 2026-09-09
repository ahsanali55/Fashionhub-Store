import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import adminRoutes from "./routes/admin.routes";
import orderRoutes from "./routes/order.routes";
import reviewRoutes from "./routes/review.routes";
import analyticsRoutes from "./routes/analytics.routes";
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
app.get("/", (_, res) => {
  console.log("GET request received at root endpoint");
  res.json({
    success: true,
    message: "FashionHub API Running Successfully",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", reviewRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error Handling Middleware
app.use(errorHandler);
export default app;