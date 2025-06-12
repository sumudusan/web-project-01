import express from "express"
import { createOrder, getOrders, getQuote, getUserCart, removeCartItem, saveUserCart, updateCartItemQuantity, updateOrder } from "../controllers/orderController.js";
import { requireAuth, verifyToken } from "../middleware/verifyToken.js";


const orderRouter = express.Router();

orderRouter.use(verifyToken);

orderRouter.post("/createOrder",requireAuth , createOrder)
orderRouter.get ("/getOrders",requireAuth, getOrders)
orderRouter.post("/quote",requireAuth, getQuote)
orderRouter.post("/cart/save", requireAuth, saveUserCart);
orderRouter.get("/cart",requireAuth,  getUserCart);
orderRouter.put("/:orderId" ,requireAuth, updateOrder)
orderRouter.delete("/cart/remove/:productId", requireAuth, removeCartItem);
orderRouter.put("/cart/update", verifyToken, updateCartItemQuantity);
export default orderRouter;