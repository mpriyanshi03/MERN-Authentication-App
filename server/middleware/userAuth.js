import  jwt from "jsonwebtoken";

const userAuth= async(req, res, next)=>{
    const { token } = req.cookies;

    if(!token){
        return res.json({success: false, message: "Not authorized, login again"});
    }

    try{

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id){
            req.user={id: tokenDecode.id};
        }else{
            return res.json({success: false, message: "Not authorized, login again"});
        }

        next();
        
    }catch(err){
        return res.json({success: false, message: err.message});
    }
}

export default userAuth;
