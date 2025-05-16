import Order from "../models/order.js";
import Product from "../models/product.js";
import { isCustomer } from "./userController.js";

export async function createOrder(req,res){
    if(!isCustomer){
        res.json({
        message : "Please login as customer to create orders"
        })
    }

    //take the latest product id

    

    try{
        const latestOrder = await Order.find().sort({date : -1}).limit(1)

    let orderId

    if(latestOrder.length == 0){
        orderId = "CBC0001"
    }else{
        const currentOrderId = latestOrder[0].orderId
        
        const numberString = currentOrderId.replace("CBC", "")

        const number = parseInt(numberString)

        const newNumber = (number+ 1).toString().padStart(4, "0");

        orderId = "CBC" + newNumber
    }

    const newOrderData = req.body
    newOrderData.orderId = orderId
    newOrderData.email = req.user.email

    const order = new Order(newOrderData)

    await order.save()

    res.json({
        message : "Order created"
    })

    }catch(error){
        res.status(500).json({
            message : error.message
        })
    }
}

export async function getOrders(req, res){

    try{
        const orderList = await Order.find()

        res.json({
            list : orderList 
        })
    }catch(e){
        res.json({
            message : "Error"
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
