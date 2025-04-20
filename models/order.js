import mongoose from "mongoose";

const orderShema = mongoose.Schema({
    orderId : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true
    },
    orderedItems : [
    {
        //orderd products details
        name : {
            type : String,
            required : true
            },
        price : {
            type : String,
            required: true
        },
        quantity : {
            type : String,
            required : true
        },
        image : {
            type : String,
            required : true
        }
    }
    ],
    date : {
        type : Number,
        default : true
    },
    paymentId : {
        type : String,
    },
    status : {
        type : String,
        default : "preparing"
    },
    notes : {
        type : String
    },
    //details of owner of the order 
    name : {
        type : String,
        required : true
    },
    address : {
        type :String,
        required : true
    },
    phone : {
        type : String,
        required : true
    }
})

const Order = mongoose.model("orders", orderShema);