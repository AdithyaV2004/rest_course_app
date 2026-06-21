const express=require('express');
const jwt=require('jsonwebtoken');
const JWT_SECRET=require('../secrets');
const {users}= require('../db/db');
const { success } = require('zod');

function auth(req, res, next){
    const token=req.headers.token;
    const decoded=jwt.verify(token, JWT_SECRET);
    const username=decoded.username;
    const user=users.find(x=>{
        return x.username==username
    });
    if(!username){    //for legit jwt auth, replace username with !user
        return res.status(401).json({
            success:false,
            message:"User not found"
        })
    }
    req.user=user;
    next();
}

module.exports=auth;