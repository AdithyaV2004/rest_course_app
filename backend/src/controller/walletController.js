const z=require('zod');

const moneySchema=z.object({
    amount:z.number()
})

async function walletController(req, res){
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
    try{
        const amt=result.data.amount;
        req.user.wallet+=amt;
        await req.user.save();
        res.json({
            success:true,
            wallet:req.user.wallet
        })
    } catch(err){
        res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

module.exports=walletController