require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./middleware.js");
const { todoModel , userModel } = require("./database.js");
app.use(express.json());


app.post("/signup",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    

    const userExist = await userModel.findOne({
        username :username,
    })

    if(userExist){
        return res.status(403).json({
            message : "user already exist"
        })
    }


    const newUser = await userModel.create({
        username: username ,
        password : password
    })

    res.json({
        message : "user signed successfully",
        userId : newUser._id 
    })
})

app.post("/signin", async (req,res)=>{

    const username = req.body.username;
    const password = req.body.password;

    const userExist = await userModel.findOne({
        username : username ,
        password : password
    })

    if(!userExist){
        return res.status(403).json({
            message:"incorrect credetials"
        })
    }

    const token = jwt.sign({
         userId : userExist._id 
    },process.env.JWT_SECRET)

    res.json({
        token : token 
    })
    
})

app.post("/todo",authMiddleware, async (req,res)=>{
    const title = req.body.title;
    const description = req.body.description;
     
     await todoModel.create({
        title : title,
        description : description ,
        userId : req.userId 
    })

    res.json({
        message: "TODO created successfully"
    })
})

app.delete("/todo/:todoId",authMiddleware, async (req,res)=>{

    const todoID = req.params.todoId ;

    const userOwnTodo = await todoModel.findOne({
        _id : todoID ,
        userId : req.userId 
    })

    if(userOwnTodo){
          await todoModel.deleteOne({
              _id : todoID
          });

         res.json({
            message : "TODO Deleted"
          })
    }

    else{
        return res.status(403).json({
            message:"ERROR"
        })
    }

})

app.get("/todo",authMiddleware,async (req,res)=>{

    const todos = await todoModel.find({
        userId : req.userId
    })

    res.json({
        todos : todos
    })
})

app.listen("3000");