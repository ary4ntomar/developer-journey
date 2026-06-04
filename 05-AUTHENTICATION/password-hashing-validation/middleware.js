const JWT = require("jsonwebtoken");

function authMiddleware(req,res,next){

    const token = req.header.token;

    const decoded = JWT.verify(token,"secretkey");

    const userId = decoded.userId;

    if(userId){
        req.userId = userId ;

        next();
    }

    else{
        res.status(403).json({
            message:"token was incorrect"
        })
    }

    module.exports={
        authMiddleware = authMiddleware
    }
}