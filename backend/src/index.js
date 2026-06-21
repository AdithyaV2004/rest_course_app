const express=require("express");
const cors=require("cors");
const jwt=require('jsonwebtoken');
const z=require('zod');
const {JWT_SECRET, MONGO_URI}=require('./secrets.js');
const userRouter=require('./routes/userRoutes.js')
const walletRouter=require('./routes/walletRoutes.js')
const profileRouter=require('./routes/profileRouter.js')
const adminRouter=require('./routes/adminRoutes.js')
const mongoose=require('mongoose')

const app=express();
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cors({
  origin: "http://localhost:5173",
  allowedHeaders: ["Content-Type", "token"]
}));

app.use(express.json());

app.use('/users', userRouter);  //user signup and signin  

app.use('/wallet', walletRouter);  //user wallet add money route

app.use('/admin', adminRouter);

app.use('/me', profileRouter);  //get user information

app.listen(3000);