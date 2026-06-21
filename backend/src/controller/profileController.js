function profileController(req, res){
    const user=req.user;
    res.json({
        success:true,
        user:{
            id:user.id,
            username:user.username,
            role:user.role,
            wallet:user.wallet
        }
    })
}

module.exports=profileController