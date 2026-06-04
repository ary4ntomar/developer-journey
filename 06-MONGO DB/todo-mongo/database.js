require("dotenv").config();
const  mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL);
//create mongoose schema and model object

//Schema for the user data
const userSchema = new mongoose.Schema({
    username : String,
    password : String
});

//Schema for the todo data
const todoSchema = new mongoose.Schema({
    title : String,
    description : String ,
    userId : mongoose.Types.ObjectId
});

const userModel = mongoose.model("users", userSchema);
const todoModel = mongoose.model("todos", todoSchema);


module.exports = {
    userModel : userModel ,
    todoModel : todoModel
}