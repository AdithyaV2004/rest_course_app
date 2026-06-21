const {Course}=require('../db/db');
const z=require('zod');

const courseSchema=z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(1)
});

async function courseController(req, res){
    const result=courseSchema.safeParse(req.body);
    if(!result.success){
        return res.status(401).json({
            success:false,
            message:"Invalid Request"
        })
    }
    const user=req.user;
    if(user.role!="admin"){
        return res.status(401).json({
            success:false,
            message:"Not Authorised"
        })
    }

    try{
        const dup=await Course.findOne({createdBy:user._id, title:result.data.title});
        if(dup){
            return res.json({
                success:false,
                message:"Course already exists"
            })
        }

        const newCourse=await Course.create({
            title:result.data.title,
            description:result.data.description,
            price:result.data.price,
            createdBy:user._id
        });

        return res.json({
            success:true,
            message:"Course Created",
            courseId:newCourse._id
        })
    } catch(err){
        res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}



async function updateCourseController(req, res){
    const result=courseSchema.safeParse(req.body);
    if(!result.success){
        return res.status(401).json({
            success:false,
            message:"Invalid Request"
        })
    } 
    const user=req.user;
    if(user.role!="admin"){
        return res.status(401).json({
            success:false,
            message:"Not Authorised"
        })
    }
    const courseId=req.params.courseId;

    try{
        const updateCourse=await Course.findOne({_id:courseId, createdBy:user._id});
        if(!updateCourse){
            return res.status(401).json({
                success:false,
                message:"Course not found"
            })
        }
        const dup=await Course.findOne({createdBy:user._id, title:result.data.title, _id:{$ne:courseId}});
        if(dup){
            return res.json({
                success:false,
                message:"Course name already exists"
            })
        }
        updateCourse.title=result.data.title;
        updateCourse.description=result.data.description;
        updateCourse.price=result.data.price;
        await updateCourse.save();

        return res.json({
            success:true,
            message:"Course Updated"
        })
    } catch(err){
        res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

async function displayCourseController(req, res){
    const user=req.user;
    if(user.role!="admin"){
        return res.status(401).json({
            success:false,
            message:"Not Authorised"
        })
    }

    try{
        const creatorCourses=await Course.find({createdBy:user._id});

        return res.json({
            success:true,
            courses:creatorCourses.length>0?creatorCourses:"No course found"
        })
    } catch(err){
        res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

module.exports={courseController, updateCourseController, displayCourseController};