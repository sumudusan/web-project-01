import User from "../models/user.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();

//admin
// "email": "aaa@gmail.com",
// "password": "123"

export function createUser(req, res){

    const newUserData = req.body

   if(newUserData.type == "admin"){

    if(req.user==null){
        res.json({
            message :"Please login "
        })
        return
    }
    

    if(req.user.type != "admin"){
        res.json({
            message :"Please login as a administartor to create admin accounts"
        })
        return
    }
    
   }

    newUserData.password = bcrypt.hashSync(newUserData.password, 10)

    const user= new User (newUserData)

   user.save().then(()=>{
    res.json({
        message :"user created"
    })
   }).catch(()=>{
    res.json({
        message : "User not created"
    })
   })
}


export function loginUser(req,res){
    User.find({email: req.body.email}).then(
        (users)=>{
            if(users.length == 0){
                res.json({
                    message:"User not found"
                })
            }
            else{
                const user=users[0]

                const isPasswordCorrect =bcrypt.compareSync(req.body.password,user.password)
           
              //  A JWT (JSON Web Token) is used for secure authentication and data exchange between a client and a server 
                if(isPasswordCorrect){
                    const token =jwt.sign({
                        email:user.email,
                        firstName:user.firstName,
                        lastName:user.lastName,
                        isBlocked:user.isBlocked,
                        type:user.type
                    } , process.env.SECRET)

                    res.json({
                        message:"User logged in",
                        token:token,
                        user: { email: user.email,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            type:user.type
                        }
                    })
                }
                else{
                    res.json({
                        message:"user not logged in (wrong password)"
                    })
                }
            }
        }
    )
}

export async function getUsers(req, res){

    try{
        const userList = await User.find()

        res.json({
            list : userList
        })
    }catch(e){
        res.json({
            message : "Error"
        })
    }
}

export function isAdmin(req){
    if(req.user==null){
        return false
    }

    if(req.user.type != "admin"){
        return false
    }

    return true
}

export function isCustomer(req){

    if(req.user==null){
        return false
    }

    if(req.user.type!= "customer"){
        return false
    }

    return true
}