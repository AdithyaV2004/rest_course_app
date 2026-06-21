const express=require('express');
const userRouter=express.Router();
const {signUpController, signInController}=require('../controller/signController.js');
const getCourseController=require('../controller/getCourseController.js');
const purchaseController=require('../controller/purchaseController.js');
const auth = require('./authRouter.js');
const { success } = require('zod');
const {courses}=require('../db/db.js')

userRouter.post('/signup', signUpController);

userRouter.post('/signin', signInController);

userRouter.use(auth);

userRouter.get('/courses', getCourseController);

userRouter.post('/courses/:courseId/purchases', purchaseController);

userRouter.get('/purchased', (req, res)=>{
    const user=req.user;
    if(user.role!='user'){
        res.status(401).json({
            success:false,
            message:"No Authorisation"
        })
    }
    const purchasedCourses=courses.filter(course =>user.purchasedCourses.includes(course.id));
    res.json({
        success:true,
        courses:purchasedCourses
    })
})

module.exports=userRouter;