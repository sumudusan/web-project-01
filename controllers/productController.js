import Product from "../models/product.js";
import { isAdmin } from "./userController.js";


export function createProduct(req, res) {
  if (!isAdmin(req)) {
    res.json({
      message: "Please login as administrator to add products",
    });
    return;
  }
  
    const newProductData = req.body;

    const product = new Product(newProductData);
  
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

export function updateProduct(){
  if(!isAdmin(req)){
    res.status(403).json({
      message : "Please login as a administrator to update a products"
    })
    return
  }
  
  const productId= req.params.productId
  const newProductData = req.body

  Product.updateOne(
    {productId : productId},
    newProductData
  ).then(()=>{
    res.json({
      message : "Product Updated"
    })
  }).catch((error)=>{
    res.status(403).json({
      message : error
    })
  })
}