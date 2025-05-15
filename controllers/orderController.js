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

export async function getQuote(req, res){
    
    try {
        // Prepare order data
        const newOrderData = req.body;

        const newProductArray = []

        let total= 0;
        let labeledTotal = 0;

        for(let i=0; i<newOrderData.orderedItems.length; i++){
            const product =await Product.findOne({
                productId : newOrderData.orderedItems[i].productId
            })

            if(product== null){
                res.json({
                    message: `Product with id ${newOrderData.orderedItems[i].productId} not found`
                });
                
                return
            }
            labeledTotal += product.price * newOrderData.orderedItems[i].qty;
            total += product.lastPrice * newOrderData.orderedItems[i].qty;

             newProductArray[i] = {
            name : product.productName,
            price : product.lastPrice, 
            labeledPrice : product.price,
            quantity : newOrderData.orderedItems[i].qty,
        image : product.images[0]
           }
        }

       console.log(newProductArray)

       newOrderData.orderedItems= newProductArray
       newOrderData.total = total;

       res.json({
        orderedItems : newProductArray,
        total: total,
        labeledTotal: labeledTotal,
       }); 

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
