import express from 'express'
import { createUser, getUsers, googleLogin, loginUser } from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post("/createuser", createUser)
userRouter.post("/login", loginUser)
userRouter.get("/getUsers" , getUsers)
userRouter.post("/google",googleLogin)

export default userRouter;

