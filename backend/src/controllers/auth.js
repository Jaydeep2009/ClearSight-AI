import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

//signup

export async function signup(req, res){
    try{
        const {name,email,password,role}=req.body;

        //check user existence

        const existingUser= await User.findOne({email});
        if(existingUser) return res.status(400).json({msg:"Email already registered"});

        //hash password
        const passwordHash=await bcrypt.hash(password,10);

        //create user

        const user= await User.create({name,email,passwordHash,role});

        //generate jwt token

        const token = jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"2d"}
        );
        
        res.json({token, user:{id:user._id, name:user.name, email: user.email, role:user.role}});
    }catch(err){
        console.error(err);
        res.status(500).json({msg:"Server error"})
    }
}


//login

export async function login(req,res){
    try{
        const{email,password}=req.body;

        //check user
        const user= await User.findOne({email});
        if(!user)return res.status(400).json({msg:"Invalid credentials"});

        //compare passwords

        const isMatch = await bcrypt.compare(password,user.passwordHash);
        if(!isMatch)return res.status(400).json({msg:"Password doesn't match"});

        //Generate JWT

        const token= jwt.sign(
            {id:user._id, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"2d"}
        );

        res.json({token,user:{id:user._id,name:user.name,email:user.email,role:user.role}});
    }catch(err){
        console.error(err);
        res.status(500).json({msg:"Server error"});
    }
}