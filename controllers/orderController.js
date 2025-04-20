import Order from "../models/order.js";
import { isCustomer } from "./userController.js";

export async function createOrder(req,res){
    if(!isCustomer){
        res.json({
        message : "Please login as customer to create orders"
        })
    }

    //take the latest product id

    

    try{
        const latestOrder = await Order.find().sort
    ({date : -1}).limit(1)

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