import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required :true,
        unique:true
    },
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
        required:true
    },
    type:{
        type:String,
        default:"customer"
    },
    password:{
        type:String,
        required:true
    }

})

const User = mongoose.model("users", userSchema)

export default User;