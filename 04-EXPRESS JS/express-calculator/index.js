const express = require("express");
const path = require("path");
const app = express();

let reqCount = 0;

app.use(function middleware(req,res,next){
    reqCount++;
    req.reqCount = reqCount;
    next();
})

app.get("/count",(req,res)=>{
    res.send(req.reqCount);
})

app.use(express.json());

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname , "index.html"));
})

app.post("/sum",(req,res)=>{
       const a =  parseInt (req.body.a);
       const b = parseInt (req.body.b);
       const sum = a + b;
       res.json({
            ans: sum 
       })
})

app.get("/sub/:a/:b",(req,res)=>{
       const a =  parseInt (req.params.a);
       const b = parseInt (req.params.b);
       const sub = a - b;
       res.json({
            ans: sub 
       })
})

app.get("/mul/:a/:b",(req,res)=>{
       const a =  parseInt (req.params.a);
       const b = parseInt (req.params.b);
       const mul = a * b;
       res.json({
            ans: mul 
       })
})

app.get("/div/:a/:b",(req,res)=>{
       const a =  parseInt (req.params.a);
       const b = parseInt (req.params.b);
       const div = a / b;
       res.json({
            ans: div 
       })
})


app.listen(3000);