const z=require('zod');

const moneySchema=z.object({
    amount:z.number()
})

function walletController(req, res){
    const result=moneySchema.safeParse(req.body);
    if(!result.success){
        return res.status(401).json({
            success:false,
            message:"Invalid request"
        })
    };
    if (req.user.role!='user'){
        return res.status(401).json({
            success:false,
            message:"Not Authorised"
        })
    }
    const amt=result.data.amount;
    req.user.wallet+=amt;
    res.json({
        success:true,
        wallet:req.user.wallet
    })
}

module.exports=walletController