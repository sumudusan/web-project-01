import Product from "../models/product.js";
import { isAdmin } from "./userController.js";


export function  createProduct (req,res){

    if(!isAdmin(req)){
        res.json({
            message : "Please logihn as administrator to add products"
        })
        return
    }

    console.log(req.user)

    if(req.user== null){
        res.json({
            message : "You are not logged in"
        })
        return
    }

    if(req.user.type !="admin"){
        res.json({
            message :"you are not an admin"
        })
        return;
    }

    const product = new Product (req.body)


    product.save().then(()=>{
        res.json({
        message: "Product created"
    })
    }).catch((error)=>{
        res.json({
            message: error 
        })
    })
    
    
}

// export function getProduct(req, res){

//     Product.find().then(

//         (productList)=>{
//             res.status(200).json({
//                 list: productList
//             })
//         }
//     ).catch(
//         (err)=>{
//             res.json({
//                 message : "Error"
//             })
//         }
//     )
// }

export async function getProduct(req,res){

    try{
        const productList = await Product.find()

        res.json({
            list : productList
        })
    }catch(e){
        res.json({
            message : "Error"
        })
    }
   
}

export function deleteProduct(req,res){

    if(!isAdmin(req)){
        res.status(403).json({
            message: "Please login as a administrator to delete a product"
        })
        return
    }

    const productId = req.params.productId

    Product.deleteOne(
        {productId : productId}
    ).then(()=>{
        res.json({
            message : "Product Deleted"
        })
    }).catch((error)=>{
        res.status(403).json({
            message : error
        })
    })
}