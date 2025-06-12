import express from "express"
import { createOrder, getOrders, getQuote, updateOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/cart/save", requireAuth, saveUserCart);
orderRouter.get("/cart",requireAuth,  getUserCart);
orderRouter.put("/:orderId" ,requireAuth, updateOrder)
orderRouter.delete("/cart/remove/:productId", requireAuth, removeCartItem);
orderRouter.put("/cart/update", verifyToken, updateCartItemQuantity);
export default orderRouter;