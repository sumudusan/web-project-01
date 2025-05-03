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
    isBlocked: {
        type: Boolean,
        default : false
    },
    type:{
        type:String,
        default:"customer"
    },
    //profilePicture :{
      //  type : String,
        //default : " "
    //},
    password:{
        type:String,
        required:true
    }

})

const User = mongoose.model("users", userSchema)

export default User;

//admin
// "email": "aaa@gmail.com",
// "password": "123"

//customer
// "email": "ddd@gmail.com",
// "password": "123"