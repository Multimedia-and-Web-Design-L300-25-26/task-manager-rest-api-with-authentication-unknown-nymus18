import express, { json } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  // - Validate input
  // - Check if user exists
  // - Hash password
  // - Save user
  // - Return user (without password)
  try{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
      return res.status(400).json({message:"Provide Credentials"});
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message:"User already exists"});
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password,saltRounds);

    const user = new User({
      name:name,
      email:email,
      password:hashedPassword
    })

    await user.save();

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

    res.status(200).json({
      message:"User registered successfully",
      token,
      user:{
        id: user._id,
        name:user.name,
        email: user.email
      }
    })
  }
  catch(err){
    console.error(error);
    res.status(500).json({message:"Server error"});
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try{
    const {email, password} = req.body;

    if(!email || !password){
      return res.status(400).json({message:"Provide credentials"});
    }
    // - Find user

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({message:"User not found"});
    }

    // - Compare password
    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.status(400).json({message:"Invalid credentials"});
    }

    // - Generate JWT
    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
    // - Return token

    res.status(200).json({
      message:"Login successful",
      token,
      user:{
        id:user._id,
        name:user.name,
        email:user.email
      }
    });

  }catch(err){
    console.error(err);
    res.status(500).json({message:"Server error"});
  }
});

export default router;