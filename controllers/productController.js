import Product from "../models/product.js";

export function addProduct (req,res){

    const productDetails = req.body

    const product = new Product (productDetails)


    product.save().then(()=>{
        res.json({
        message: "Product Added"
    })
    }).catch(()=>{
        res.json({
            message: "Product not added"
        })
    })
    
    
}