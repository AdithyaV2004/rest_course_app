const express=require('express');
const walletRouter=express.Router();
const auth=require('./authRouter');
const walletController=require('../controller/walletController');

walletRouter.use(auth);   //Call auth middleware
walletRouter.post('/add', walletController);

module.exports=walletRouter;