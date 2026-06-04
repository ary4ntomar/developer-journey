const express = require("express");
const path = require("path");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());
let notes = [];
let users =[];


app.post("/signup",(req,res)=>{
    const username = req.body.username ;
    const password = req.body.password ;
    const userExist = users.find(user => user.username === username );
    if(userExist){
        return res.status(403).json({
            message: "user already exist"
        })
    }

    users.push({
        username : username,
        password : password 
    })

    res.json({
        message : "you have signed up"
    })
})

app.post("/signin",(req,res)=>{
    const password = req.body.password ;
    const username  = req.body.username ;
    const userExist = users.find(user => user.username === username && user.password === password);
    if(!userExist){
            res.status(403).json({
                message : "incorrect credentials"
            })
            return ;
    }
  
    //jwt

    const token = jwt.sign({
        username:username 
    },"secretkey");
res.json({
 token:token
})

})


//POST - Create a note - Authenticated endpoint
app.post("/notes",(req,res)=>{
//check if they have sent the right header , extract who this user is from the header.

const token = req.headers.token;
   
if(!token){
    res.status(403).send({
        message:" you are not logged in"
    });
    return ;
}

const decoded = jwt.verify(token,"secretkey");
const username = decoded.username ;

if(!username){
    res.status(403).json({
        message: "malformed token"
    })
    return ;
}
    const note = req.body.note;
    notes.push({note , username});
    res.send("note added");
})


app.get("/notes",(req,res)=>{

const token = req.headers.token;
   
if(!token){
    res.status(403).send({
        message:" you are not logged in"
    });
    return ;
}

const decoded = jwt.verify(token,"secretkey");
const username = decoded.username ;

if(!username){
    res.status(403).json({
        message: "malformed token"
    })
    return ;
}

const userNotes = notes.filter(note=> note.username === username);
    res.json({
        notes: userNotes
    })
})

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"frontend","index.html"));
})


app.listen(3000);