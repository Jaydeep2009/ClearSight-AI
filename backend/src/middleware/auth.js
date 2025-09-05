import jwt from "jsonwebtoken";

//protect routes

export function authMiddleware(req,res,next){
    const authHeader= req.headers.authorization;
    if(!authHeader)return res.status(401).json({msg:"No token provider"});

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        next();
    }catch(err){
        return res.status(401).json({msg:"invalid token"});
    } 
}


//role based access

export function requireRole(role){
    return (req,res,next)=>{
        if(!req.user)return res.status(401).json({msg:"Unauthorized"});
        if(req.user.role!==role && req.user.role!=="admin"){
            return res.status(403).json({msg:"Forbidden"});
        }
        next();
    };
}