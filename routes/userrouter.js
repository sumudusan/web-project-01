import express from 'express'
import { createUser, getUser, googleLogin, loginUser } from '../controllers/userController.js'

const userRouter = express.Router();

userRouter.post("/register", createUser)
userRouter.post("/login", loginUser)
userRouter.get("/" , getUser)
userRouter.post("/google",googleLogin)


export default userRouter;

