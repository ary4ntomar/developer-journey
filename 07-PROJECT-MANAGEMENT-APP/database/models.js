require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

//schemas

const userSchema = mongoose.Schema({
    username : String ,
    password : String
})

const organizationSchema = mongoose.Schema({
    title : String ,
    description : String ,
    admin : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    members : [{
        type: mongoose.Types.ObjectId,
        ref : "User"
    }]
})

const boardsSchema = mongoose.Schema({
    title : String,
    organizationId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Organization"
    } 

})

const issuesSchema = mongoose.Schema({
     title:String,
     boardId : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Board"
     }, 
     status :{
       type : String,
       default :"upnext"
     },
     assignedTo : {
       type: mongoose.Schema.Types.ObjectId,
       ref:"User"
     }  
})


//models

const userModel = mongoose.model("User",userSchema);
const organizationModel = mongoose.model("Organization",organizationSchema);
const boardModel = mongoose.model("Board",boardsSchema);
const issueModel = mongoose.model("Issue",issuesSchema);


module.exports ={
    userModel,
    organizationModel,
    boardModel,
    issueModel
}