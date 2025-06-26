const User = require('./../models/userModel')

exports.createUser = async (req,res,next)=>{
    try{
        const newUser = await User.create(req.body)
         res.status(201).json({
            status:"success",
            data:{newUser}
            })
    }
    catch(err){
        // res.status(400).json({
        //     status:"fail",
        //     message:err.message
        //     })
        next(err)
    }
}