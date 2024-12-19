import jwt from "jsonwebtoken"

export const authMiddleware = async(req,res,next) =>{
    console.log("cookie",req.cookies)
    const {authToken} = req.cookies
    if(!authToken){
        return res.json({success:false,message:"Login Expired Login Again !"})
    }
    try {
        const decodeid = jwt.verify(authToken,process.env.SECRET_KEY)
        if(decodeid.id){
            req.body.userId = decodeid.id
        }
        else{
            return res.json({success:false,message:"Login Again !"})
        }
        next()
    } catch (error) {
        return res.status(500).json({success:false,message:error.message})
    }
}