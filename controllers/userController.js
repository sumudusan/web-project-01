import User from "../models/user.js";
import bcrypt from "bcryptjs"; // ✅ changed from 'bcrypt'
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Middleware to authenticate user via JWT
export function authenticateUser(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1]; // Format: "Bearer <token>"

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded;
  } catch (err) {
    req.user = null;
  }

  next();
}

// Create new user (admin/customer)
export async function createUser(req, res) {
  const newUserData = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: newUserData.email });
    if (existingUser) {
      return res.json({ message: "Email already registered" });
    }

    // Only admin can create another admin
    if (newUserData.type === "admin") {
      if (!req.user || req.user.type !== "admin") {
        return res.json({
          message: "Please login as an administrator to create admin accounts",
        });
      }
    }

    // Hash password
    newUserData.password = await bcrypt.hash(newUserData.password, 10);
    const user = new User(newUserData);
    await user.save();

    res.json({ message: "User created", user });
  } catch (error) {
    res.json({ message: "User not created", error: error.message });
  }
}


// Login existing user
export async function loginUser(req, res) {
  try {
    const users = await User.find({ email: req.body.email });

    if (users.length === 0) {
      return res.json({ message: "User not found" });
    }

    const user = users[0];

    // ✅ Use bcryptjs to compare password
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (isPasswordCorrect) {
      const token = jwt.sign(
        {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isBlocked: user.isBlocked,
          type: user.type,
        },
        process.env.SECRET
      );

      res.json({
        message: "User logged in",
        token,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type,
        },
      });
    } else {
      res.json({ message: "User not logged in (wrong password)" });
    }
 } catch (e) {
  console.error("Google login error:", e?.response?.data || e.message || e);
  res.json({
    message: "Google login failed"
  });
}
}

// Get all users
export async function getUsers(req, res) {
  try {
    const userList = await User.find();
    res.json({ list: userList });
  } catch (e) {
    res.json({ message: "Error", error: e.message });
  }
}

// Role helpers
export function isAdmin(req) {
  return req.user && req.user.type === "admin";
}

export function isCustomer(req) {
  return req.user && req.user.type === "customer";
}

export async function googleLogin(req, res) {
  const token = req.body.token;

  try {
    const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // ✅ Log the full response from Google to see what fields are available
    console.log("Google user data:", response.data);

    const email = response.data.email;

    // Check if user exists
    const usersList = await User.find({ email: email });
    if (usersList.length > 0) {
      const user = usersList[0];
      const token = jwt.sign({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isBlocked: user.isBlocked,
        type: user.type,
        profilePicture: user.profilePicture
      }, process.env.SECRET);

      res.json({
        message: "User logged in",
        token: token,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type,
          profilePicture: user.profilePicture,
          email: user.email
        }
      });
    } else {
      // Create new user
      const newUserData = {
  email: email,
  firstName: response.data.given_name || "Google",
  lastName: response.data.family_name || "User",
  type: "customer",
  password: "ffffff", // optionally randomize or handle differently
  profilePicture: response.data.picture || ""
};

      const user = new User(newUserData);
      await user.save();

      const token = jwt.sign({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isBlocked: user.isBlocked,
        type: user.type,
        profilePicture: user.profilePicture
      }, process.env.SECRET);

      res.json({
        message: "User logged in",
        token: token,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          type: user.type,
          profilePicture: user.profilePicture,
          email: user.email
        }
      });
    }

  } catch (e) {
    console.error(e);
    res.json({
      message: "Google login failed"
    });
  }
}


export async function getUser(req,res){
  if(req.user==null){
    res.status(404).json({
      message : "please login to view user dtails"
    })
    return
  }
  res.json(req.user)
}