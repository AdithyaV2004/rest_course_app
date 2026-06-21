const express=require('express');
const profileRouter=express.Router();
const auth=require('./authRouter');
const profileController=require('../controller/profileController')

profileRouter.use(auth);
profileRouter.get('/', profileController)

module.exports=profileRouter;