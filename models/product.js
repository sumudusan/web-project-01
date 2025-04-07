import mongoose  from "mongoose";

const productSchema = mongoose.Schema({

    name : {
        type : String,
        required : true,
        unique : true
    },
    quantity : {
        type : Number,
        require : true
    },
    price : {
        type: Number,
        require: true
    }
})

const Product= mongoose.model ("products", productSchema)
export default Product;