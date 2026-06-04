const express = require("express");
const app = express();

let port = 3000;

app.listen(port,()=>{
    console.log("i am listening")
});

app.get("/form",(req,res)=>{
    console.log("GET response Send");
    res.send("standard get response")
});
app.post("/form",(req,res)=>{
    console.log("POST request send")
    res.send("standard post response")
});