import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import productRouter from "./routes/productrouter.js";
import orderRouter from "./routes/orderRouter.js";
import userRouter from "./routes/userrouter.js";
import contactRouter from "./routes/contactRouter.js";

dotenv.config();

const app = express();

// ---------- MIDDLEWARE SETUP ---------- //
app.use(cors());
app.use(express.json());

// ✅ JWT Authentication Middleware
app.use((req, res, next) => {
  const authHeader = req.header("Authorization");

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");
    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      console.log("Authenticated:", decoded);
      req.user = decoded;
    } catch (err) {
      console.log("Invalid token:", err.message);
      // Optional: Uncomment if you want to block invalid tokens completely
      // return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  next(); // ✅ Call next after decoding (or skipping if no token)
});

// ---------- DATABASE CONNECTION ---------- //
const mongoURL = process.env.MONGO_DB_URL;

mongoose.connect(mongoURL, {});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("✅ Database Connected");
});

// ---------- ROUTES ---------- //
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/contact", contactRouter);

// ---------- SERVER ---------- //
app.listen(5000, () => {
  console.log("🚀 Server is running on port 5000");
});
