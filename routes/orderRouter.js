import express from "express"
import { createOrder, getOrders, getQuote } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/createOrder", createOrder)
orderRouter.get ("/getOrders", getOrders)
orderRouter.get("/quote", getQuote)

export default orderRouter;