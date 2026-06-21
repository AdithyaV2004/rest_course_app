const express=require('express');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../secrets');
const {User}= require('../db/db');

async function auth(req, res, next){
    const token=req.headers.token;
    try{
        const decoded=jwt.verify(token, JWT_SECRET);
        const username=decoded.username;
        const user=await User.findOne({username:username});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }
        req.user=user;
        next();
    } catch(err){
        return res.status(401).json({
            success:false,
            message:"Invalid or missing token"
        })
    }
}

module.exports=auth;