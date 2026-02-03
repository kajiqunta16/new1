import express, { Application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user-routes";
import productRoutes from "./routes/product-routes";
import orderRoutes from "./routes/order-routes";
import cartRoutes from "./routes/cart-routes";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 5000;

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then((): void => {
    console.log("Connected to MongoDB");
  })
  .catch((err: Error): void => {
    console.error("Error connecting to MongoDB", err);
  });

// Server
app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
