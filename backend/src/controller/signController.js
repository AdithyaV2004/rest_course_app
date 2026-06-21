const z=require('zod');
const {User}=require('../db/db.js');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../secrets.js');


const signUpSchema=z.object({
    username:z.string().min(3),
    password:z.string().min(6),
    role:z.enum(['admin', 'user'])
});

const signInSchema=z.object({
    username:z.string().min(3),
    password:z.string().min(6)
})

async function signUpController(req, res){
    const result=signUpSchema.safeParse(req.body);
    if(!result.success){
        return res.status(401).json({
            success:false,
            message:"Invalid Credentials"
        })
    }
    const user=result.data;

    try{
        const dup=await User.findOne({username:user.username});
        if(dup){
            return res.status(401).json({
                success:false,
                message:"Username already Exists"
            })
        }

        const token=jwt.sign({
            username:user.username
        }, JWT_SECRET);

        await User.create({
            username:user.username,
            password:user.password,
            role:user.role,
            wallet:0,
            purchasedCourses:[],
            token:token
        });

        res.json({
            success:true,
            message:"User successfully created",
            token:token
        });
    } catch(err){
        res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

async function signInController(req, res){
    const result=signInSchema.safeParse(req.body);
    if(!result.success){
        return res.status(401).json({
            success:false,
            message:"Invalid Credentials"
        })
    }
    const user=result.data;

    try{
        const dup=await User.findOne({username:user.username, password:user.password});
        if(!dup){
            return res.status(401).json({
                success:false,
                message:"Incorrect Credentials"
            });
        }
        const token=jwt.sign({
            username:user.username
        }, JWT_SECRET);
        dup.token=token;
        await dup.save();
        res.json({
            success:true,
            message:"Sign in Successful",
            token:token
        });
    } catch(err){
        res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

module.exports={
    signInController:signInController,
    signUpController:signUpController
};