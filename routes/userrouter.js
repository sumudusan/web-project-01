import express from 'express'
import { createUser, getUsers, loginUser } from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post("/createuser", createUser)
userRouter.post("/login", loginUser)
userRouter.get("/getUsers" , getUsers)

export default userRouter;

