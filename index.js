import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userrouter.js';

const app=express();

const mongoUrl = "mongodb+srv://root:123@cluster0.dgneb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongoose.connect(mongoUrl,{})
const connection = mongoose.connection;
connection.once("open", ()=>{
    console.log("Database Connected");
})

app.use(bodyParser.json())

app.use("/api/users", userRouter)




//1.14 day 3 paused
app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });


 // DUWYl5LQEy4Q6Dj8