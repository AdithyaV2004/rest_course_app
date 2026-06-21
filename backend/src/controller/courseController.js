const {courses, users}=require('../db/db');
const z=require('zod');

count=1;

const courseSchema=z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(1)
});

function courseController(req, res){
    const result=courseSchema.safeParse(req.body);
    if(!result.success){
        res.status(401).json({
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
    const creatorCourses=courses.filter(x=>x.createdBy==user.id);
    const dup=creatorCourses.find(x=>x.title==result.data.title);
    if(dup){
        return res.json({
            success:false,
            message:"Course already exists"
        })
    }

    courses.push({
        id:`course_${count}`,
        title:result.data.title,
        description:result.data.description,
        price:result.data.price,
        createdBy:user.id
    });

    return res.json({
        success:true,
        message:"Course Created",
        courseId:`course_${count++}`
    })
}



function updateCourseController(req, res){
    const result=courseSchema.safeParse(req.body);
    if(!result.success){
        res.status(401).json({
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

    const creatorCourses=courses.filter(x=>x.createdBy==user.id);
    const updateCourse=creatorCourses.find(x=>x.id==courseId);
    if(!updateCourse){
        return res.status(401).json({
            success:false,
            message:"Course not found"
        })
    }
    const dup=creatorCourses.find(x=>x.title==result.data.title);
    if(dup){
        return res.json({
            success:false,
            message:"Course name already exists"
        })
    }
    updateCourse.title=result.data.title;
    updateCourse.description=result.data.description;
    updateCourse.price=result.data.price;

    return res.json({
        success:true,
        message:"Course Updated"
    })
}

function displayCourseController(req, res){
    const user=req.user;
    if(user.role!="admin"){
        return res.status(401).json({
            success:false,
            message:"Not Authorised"
        })
    }
    const courseId=req.params.courseId;

    const creatorCourses=courses.filter(x=>x.createdBy==user.id);

    return res.json({
        success:true,
        courses:creatorCourses.length>0?creatorCourses:"No course found"
    })
}

module.exports={courseController, updateCourseController, displayCourseController};