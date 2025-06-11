import express from "express"
import { createOrder, getOrders, getQuote, updateOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/cart/save", requireAuth, saveUserCart);
export default orderRouter;