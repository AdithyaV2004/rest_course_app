const express=require("express");
const jwt=require('jsonwebtoken');
const z=require('zod');
const JWT_SECRET=require('./secrets.js');
const {users, courses}=require('./db/db.js');
const userRouter=require('./routes/userRoutes.js')
const walletRouter=require('./routes/walletRoutes.js')
const profileRouter=require('./routes/profileRouter.js')
const adminRouter=require('./routes/adminRoutes.js')

const app=express();

app.use(express.json());

app.use('/users', userRouter);  //user signup and signin  

app.use('/wallet', walletRouter);  //user wallet add money route

app.use('/admin', adminRouter);




app.use('/me', profileRouter);  //get user information



app.listen(3000);