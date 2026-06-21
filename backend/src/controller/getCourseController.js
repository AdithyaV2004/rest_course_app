const {Course}=require('../db/db')

async function getCourseController(req, res){
    try{
        const courses=await Course.find();
        res.json({
            success:true,
            courses:courses
        })
    } catch(err){
        res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

module.exports=getCourseController;