import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"

import userRouter from "./routes/userRouter.js";
import jwt from "jsonwebtoken";
import { authenticateUser } from "./controllers/userController.js";
import dotenv from "dotenv";
import productRouter from "./routes/productrouter.js";
import orderRouter from "./routes/orderRouter.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(authenticateUser);

const mongoURL = process.env.MONGO_DB_URL;
app.use(cors());

mongoose.connect(mongoURL, {});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Database Connected");
});

//-------------middleware-----------//

app.use(bodyParser.json());

app.use((req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log(token);

  if (token != null) {
    jwt.verify(token, process.env.SECRET, (error,decoded) => {
      if (!error) {
        console.log(decoded);
        req.user = decoded;
      }
    });
  }

  next();
});

//---------------------------------//

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

app.listen(5000, () => {
  console.log("server is running on port 5000");
});