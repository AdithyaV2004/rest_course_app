const { success } = require('zod');
const {courses, users}=require('../db/db');

function purchaseController(req,res){
    const courseId=req.params.courseId;
    const user=req.user;
    if (user.role!='user'){
        return res.statsu(401).json({
            success:false,
            message:"Not Authorised"
        })
    }

    const course=courses.find(x=>x.id==courseId);
    if(!course){
        return res.status(401).json({
            success:false,
            message:"No course found"
        })
    }
    const dup=user.purchasedCourses.find(x=>x==courseId)
    if(dup){
        return res.status(401).json({
            success:false,
            message:"Course Already Purchased"
        })
    }
    if(user.wallet<course.price){
        return res.status(401).json({
            success:false,
            message:"Insufficient Funds"
        })
    }
    user.wallet-=course.price;
    user.purchasedCourses.push(courseId);
    res.json({
        success:true,
        message:"Course Purchased",
    remainingWallet:user.wallet
    })


}

module.exports=purchaseController;