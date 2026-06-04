const express=require("express");
const app = express();

let port = 3000;

app.listen(port,()=>{
    console.log('app is listening');
})

app.get("/",(req,res)=>{
    console.log("request received");
    res.send("welcome to home");
})
app.get("/contact/:username",(req,res)=>{
    let{username}=req.params;
    console.log("request received");
    res.send(`Contact ${username} on 454545`)
})

app.get("/social",(req,res)=>{
    console.log("request received");
    res.send(`<h1>SOCIALS</h1>
    <ul>
        <li>INSTA : ary4ntomar</li>
        <li>X: ary4ntomar<li>
    </ul>`);
});

app.get("/search",(req,res)=>{
    let{q}=req.query;
    res.send(`this"${q}"query is working`)
})