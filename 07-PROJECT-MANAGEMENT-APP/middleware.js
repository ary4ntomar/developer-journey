require("dotenv").config();
const jwt = require("jsonwebtoken");  //import JWT library

//create a middleware function
function authMiddleware(req,res,next){
    
    //extract token from request headers
    const token = req.headers.token;

    //  then verify token
    const decoded = jwt.verify(token ,process.env.JWT_SECRET);   //jwt.verify() checks if token is valid , modified and secretkey is correct , if valid then returns original payload.
     
    //extract userID from decoded payload
    const userId = decoded.userId;

    //store userId inside req if user is valid
    if(userId){
    req.userId = userId ;

    //continue to route
    next()
    }
    //if not exist then send error response
     else{
        res.status(403).json({
            message : " token was incorrect"
        })
     }
}

module.exports={
    authMiddleware : authMiddleware           // exports authmidddleware property to the other files
}                                       