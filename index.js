import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userrouter.js';
import productRouter from './routes/productrouter.js';
import { decode } from 'jsonwebtoken';
import jwt from "jsonwebtoken"

const app=express();

const mongoUrl = "mongodb+srv://root:123@cluster0.dgneb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(mongoUrl,{})
const connection = mongoose.connection;
connection.once("open", ()=>{
    console.log("Database Connected");
})

app.use(bodyParser.json())

//make own middleware   : if we send a token with a req ,this middleware will get
//it and pass the correct router (ex:userRouter,productRouter ) to that token. 
app.use(
    (req, res, next)=>{
        
        const token = req.header("Authorization")?.replace("Bearer" , "")
        console.log(token)

        if(token != null){
            jwt.verify(token ,"cbc-secret-key-7973 " , (error,decoded)=>{
                if(!error){
                    console.log(decoded)
                    req.user= decoded
                }
            })
        }
     next()
    }
    
)

app.use("/api/users", userRouter)
app.use("/api/products", productRouter)



//1.14 day 3 paused
app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });


 // DUWYl5LQEy4Q6Dj8