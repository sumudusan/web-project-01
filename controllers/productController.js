import Product from "../models/product.js";


export function addProduct (req,res){

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
    }

    const product = new Product (req.body)


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