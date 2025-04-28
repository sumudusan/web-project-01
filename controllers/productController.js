import Product from "../models/product.js";
import { isAdmin } from "./userController.js";


export function createProduct(req, res) {
    if (!req.user || req.user.type !== "admin") {
      return res.status(403).json({
        message: "You must be logged in as an admin to add products.",
      });
    }
  
    const product = new Product(req.body);
  
    product
      .save()
      .then((savedProduct) => {
        res.json({
          message: "Product created successfully",
          product: savedProduct, // Optionally send back the created product
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Error creating product",
          error: error.message,
        });
      });
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