const {courses}=require('../db/db')
function getCourseController(req, res){
    res.json({
        success:true,
        courses:courses
    })
}

module.exports=getCourseController;