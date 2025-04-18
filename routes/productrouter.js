import express from "express";
import { addProduct, getProduct } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", addProduct)
productRouter.get("/", getProduct)

export default productRouter;