const express=require('express');
const adminRouter=express.Router();

const {courseController, updateCourseController, displayCourseController}=require('../controller/courseController');
const auth = require('./authRouter');

adminRouter.use(auth);

adminRouter.post('/courses', courseController);

adminRouter.put('/courses/:courseId', updateCourseController);

adminRouter.get('/courses', displayCourseController);

module.exports=adminRouter;