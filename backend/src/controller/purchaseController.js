const {Course, User}=require('../db/db');

async function purchaseController(req,res){
    const courseId=req.params.courseId;
    const user=req.user;
    if (user.role!='user'){
        return res.status(401).json({
            success:false,
            message:"Not Authorised"
        })
    }

    try{
        const course=await Course.findById(courseId);
        if(!course){
            return res.status(401).json({
                success:false,
                message:"No course found"
            })
        }
        const dup=user.purchasedCourses.find(x=>x.toString()==courseId);
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
        user.purchasedCourses.push(course._id);
        await user.save();
        res.json({
            success:true,
            message:"Course Purchased",
            remainingWallet:user.wallet
        })
    } catch(err){
        res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

module.exports=purchaseController;