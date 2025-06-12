import express from 'express'
import {   createUser,  deleteUserById,  getAllUsers,     getUser,   googleLogin, loginUser } from '../controllers/userController.js'
import { verifyToken } from '../middleware/verifyToken.js';

const userRouter = express.Router();

userRouter.post("/register", createUser)
userRouter.post("/login", loginUser)
userRouter.get("/" ,verifyToken, getUser) //this is using in when login
userRouter.post("/google" ,googleLogin)
userRouter.get("/All",verifyToken, getAllUsers) //uses AdminCustomer  page
userRouter.delete("/:id", verifyToken, deleteUserById);

export default userRouter;

