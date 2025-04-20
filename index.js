import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userrouter.js';
import productRouter from './routes/productrouter.js';
import jwt from "jsonwebtoken"
import cors from "cors";
import dotenv from "dotenv";
import orderRouter from './routes/orderRouter.js';
dotenv.config()

const app=express();
app.use(cors())

const mongoUrl = process.env.MONGO_DB_URL
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
        
        const token = req.header("Authorization")?.replace('Bearer ' , '')
        console.log(token)

        if(token ){
            jwt.verify(token , process.env.SECRET , (error,decoded)=>{
                if(!error){
                    req.user= decoded
                }
            })
        }
     next();
    });

app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use("/api/orders", orderRouter)


//1.14 day 3 paused
app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });


 // DUWYl5LQEy4Q6Dj8