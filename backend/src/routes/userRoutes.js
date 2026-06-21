const express=require('express');
const userRouter=express.Router();
const {signUpController, signInController}=require('../controller/signController.js');
const getCourseController=require('../controller/getCourseController.js');
const purchaseController=require('../controller/purchaseController.js');
const auth = require('./authRouter.js');
const { success } = require('zod');

userRouter.post('/signup', signUpController);

userRouter.post('/signin', signInController);

userRouter.use(auth);

userRouter.get('/courses', getCourseController);

userRouter.post('/courses/:courseId/purchases', purchaseController);

userRouter.get('/purchased', async (req, res)=>{
    const user=req.user;
    if(user.role!='user'){
        return res.status(401).json({
            success:false,
            message:"No Authorisation"
        })
    }
    try{
        await user.populate('purchasedCourses');
        res.json({
            success:true,
            courses:user.purchasedCourses
        })
    } catch(err){
        res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
})

module.exports=userRouter;