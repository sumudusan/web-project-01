import Order from "../models/order.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import {isAdmin, isCustomer } from "./userController.js";

export async function createOrder(req, res) {
  if (!isCustomer(req)) {
    return res.json({ message: "Please login as customer to create order" });
  }

  try {
    const latestOrder = await Order.find().sort({ orderId: -1 }).limit(1);
    let orderId = latestOrder.length === 0
      ? "CBC0001"
      : "CBC" + (parseInt(latestOrder[0].orderId.replace("CBC", "")) + 1).toString().padStart(4, "0");

    const newOrderData = req.body;
    const newProductArray = [];

    for (let item of newOrderData.orderedItems) {
      const product = await Product.findOne({ productId: item.productId });

      if (!product) {
        return res.json({ message: `Product with id ${item.productId} not found` });
      }

      newProductArray.push({
        name: product.productName,
        price: product.lastPrice,
        quantity: item.qty,
        image: product.images[0],
      });
    }

    newOrderData.orderedItems = newProductArray;
    newOrderData.orderId = orderId;
    newOrderData.email = req.user.email;

    const order = new Order(newOrderData);
    const savedOrder = await order.save();

    // 🧹 Remove ordered items from user's cart
    const user = await User.findOne({ email: req.user.email });
    if (user) {
      const orderedProductIds = newOrderData.orderedItems.map((item) => item.productId);
      user.cart = user.cart.filter((item) => !orderedProductIds.includes(item.productId));
      await user.save();
    }

    res.json({ message: "Order created", order: savedOrder });
  } catch (error) {
    console.error("Order creation error:", error.message);
    res.status(500).json({ message: error.message });
  }
}


export async function getOrders(req,res){
    try{
    if(isCustomer(req)){
        const orders = await Order.find({email : req.user.email})
        res.json(orders)
        return;
    }else if(isAdmin(req)){
        const orders = await Order.find({});
        res.json(orders)
        return;
    }else{
        res.json({
            message : "Please login to view orders"
        })
    }
 }catch(error){
    res.status(500).json({
        message : error.message,
    })
 }
}

export async function getQuote(req, res) {
  try {
    const { orderedItems } = req.body;

    if (!orderedItems || !Array.isArray(orderedItems) || orderedItems.length === 0) {
      return res.status(400).json({
        message: "No ordered items found in request.",
      });
    }

    const newProductArray = [];
    let total = 0;
    let labeledTotal = 0;

    for (let i = 0; i < orderedItems.length; i++) {
      const { productId, qty } = orderedItems[i];

      const product = await Product.findOne({ productId });

      if (!product) {
        // Optional: you can choose to skip this item or notify the user
        console.warn(`Product with ID ${productId} not found.`);
        continue;
      }

      const itemTotal = product.lastPrice * qty;
      const itemLabeledTotal = product.price * qty;

      labeledTotal += itemLabeledTotal;
      total += itemTotal;

      newProductArray.push({
        name: product.productName,
        price: product.lastPrice,
        labeledPrice: product.price,
        quantity: qty,
        image: product.images?.[0] || "",
      });
    }

    res.json({
      orderedItems: newProductArray,
      total,
      labeledTotal,
    });

  } catch (error) {
    console.error("Error generating quote:", error);
    res.status(500).json({
      message: error.message || "Server error while generating quote.",
    });
  }
}

export async function updateOrder(req, res) {
    if (!isAdmin(req)) {
      res.json({
        message: "Please login as admin to update orders",
      });
    }
    
    try {
      const orderId = req.params.orderId;
  
      const order = await Order.findOne({
        orderId: orderId,
      });
  
      if (order == null) {
        res.status(404).json({
          message: "Order not found",
        })
        return;
      }
  
      const notes = req.body.notes;
      const status = req.body.status;
  
      const updateOrder = await Order.findOneAndUpdate(
        { orderId: orderId },
        { notes: notes, status: status }
      );
  
      res.json({
        message: "Order updated",
        updateOrder: updateOrder
      });
  
    }catch(error){
  
      
      res.status(500).json({
        message: error.message,
      });
    }
  }

// Save or update user's cart
export async function saveUserCart(req, res) {
  try {
    if (!isCustomer(req)) {
      return res.status(401).json({ message: "Unauthorized. Please login as a customer." });
    }

    const { cartItems } = req.body;

    if (!Array.isArray(cartItems)) {
      return res.status(400).json({ message: "Invalid cart data." });
    }

    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If cartItems is empty, clear the cart
    if (cartItems.length === 0) {
      user.cart = [];
      await user.save();
      return res.json({ message: "Cart cleared successfully", cart: [] });
    }

    const currentCart = user.cart || [];

    // Merge new cartItems into currentCart
    cartItems.forEach(newItem => {
      const index = currentCart.findIndex(item => item.productId === newItem.productId);

      if (index > -1) {
        currentCart[index].qty += newItem.qty;
      } else {
        currentCart.push(newItem);
      }
    });

    user.cart = currentCart;
    await user.save();

    res.json({ message: "Cart updated successfully", cart: user.cart });
  } catch (err) {
    console.error("Cart save error:", err);
    res.status(500).json({ message: err.message });
  }
}




export async function getUserCart(req, res) {
  try {
    console.log("Authenticated user:", req.user);

    if (!isCustomer(req)) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      console.warn("User not found:", req.user.email);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Returning cart:", user.cart);
    res.json(user.cart || []);
  } catch (err) {
    console.error("getUserCart error:", err.message);
    res.status(500).json({ message: err.message });
  }
}

export async function removeCartItem(req, res) {
  try {
    console.log("Authenticated user:", req.user);

    const userEmail = req.user?.email;
    const { productId } = req.params;

    if (!userEmail) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.warn("User not found:", userEmail);
      return res.status(404).json({ message: "User not found" });
    }

    user.cart = user.cart.filter(item => item.productId !== productId);
    await user.save();

    console.log(`Item ${productId} removed from ${userEmail}'s cart.`);
    res.json({ message: "Item removed from cart", cart: user.cart });
  } catch (err) {
    console.error("removeCartItem error:", err.message);
    res.status(500).json({ message: err.message });
  }
}


export async function updateCartItemQuantity(req, res) {
  try {
    console.log("Authenticated user:", req.user);

    const userEmail = req.user?.email;
    const { productId, qty } = req.body;

    if (!userEmail) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    if (!productId || typeof qty !== "number" || qty < 1) {
      return res.status(400).json({ message: "Invalid product ID or quantity" });
    }

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      console.warn("User not found:", userEmail);
      return res.status(404).json({ message: "User not found" });
    }

    const cartItem = user.cart.find(item => item.productId === productId);

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.qty = qty;
    await user.save();

    console.log(`Quantity of ${productId} updated to ${qty} for ${userEmail}.`);
    res.json({ message: "Cart item quantity updated", cart: user.cart });
  } catch (err) {
    console.error("updateCartItemQuantity error:", err.message);
    res.status(500).json({ message: err.message });
  }
}
