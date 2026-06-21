const z=require('zod');
const {users, courses}=require('../db/db.js');
const jwt=require('jsonwebtoken');
const JWT_SECRET=require('../secrets.js');


const signUpSchema=z.object({
    username:z.string().min(3),
    password:z.string().min(6),
    role:z.enum(['admin', 'user'])
});

const signInSchema=z.object({
    username:z.string().min(3),
    password:z.string().min(6)
})
ucount=1;
acount=1;

function signUpController(req, res){
    const result=signUpSchema.safeParse(req.body);
    if(!result.success){
        return res.status(401).json({
            success:false,
            message:"Invalid Credentials"
        })
    }
    const user=result.data;
    const dup=users.find(x=>x.username==user.username);
    if(dup){
        return res.status(401).json({
            success:false,
            message:"Username already Exists"
        })
    }

    const token=jwt.sign({
        username:user.username
    }, JWT_SECRET);

    users.push({
        id: (user.role=='user'?`user_${ucount++}`:`admin_${acount++}`),
        username:user.username,
        password:user.password,
        role:user.role,
        wallet:0,
        purchasedCourses:(user.role=='user'?[]:null),
        token:token
    });

    res.json({
        success:true,
        message:"User successfully created",
        token:token
    });
}

function signInController(req, res){
    const result=signInSchema.safeParse(req.body);
    if(!result.success){
        return res.status(401).json({
            success:false,
            message:"Invalid Credentials"
        })
    }
    const user=result.data;
    const dup=users.find(x=>{
        
        return x.username==user.username && x.password==user.password
    });
    if(!dup){
        res.status(401).json({
            success:false,
            message:"Incorrect Credentials"
        });
    }
    const token=jwt.sign({
        username:user.username
    }, JWT_SECRET);
    dup.token=token;
    res.json({
        success:true,
        message:"Sign in Successful",
        token:token
    });
}

module.exports={
    signInController:signInController,
    signUpController:signUpController
};