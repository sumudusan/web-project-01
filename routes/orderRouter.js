import express from "express"
import { createOrder, getOrders, getQuote, updateOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/cart/save", requireAuth, saveUserCart);
orderRouter.get("/cart",requireAuth,  getUserCart);
orderRouter.delete("/cart/remove/:productId", requireAuth, removeCartItem);
export default orderRouter;