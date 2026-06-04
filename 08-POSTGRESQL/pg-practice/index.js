const express = require("express");
const {Pool} = require('pg');
const JWT = require("jsonwebtoken");
const {authMiddleware}= require("./middleware")

const pool = new Pool({
    connectionString:"postgresq-url"
})

const app = express();
app.use(express.json());

app.post('/signup',async(req,res)=>{
     const {username ,email, password} = req.body;

     const userExist = await pool.query
     ("SELECT * FROM users WHERE username= $1 OR email = $2",
        [username,email]
     );

     if(userExist.rows.length>0){
         return res.status(403).json({
            message:"user already exist"
        })
     }

    const response = await pool.query(
      `INSERT INTO users(username,email,password) 
       VALUES($1,$2,$3) RETURNING id;`
      ,[username,email,password]
    )

     //a very bad ways to do sql using PG ---this is vulnerable to sql injection
    
     //  await pool.query(`INSERT INTO users(username,email,password) VALUES('${username}','${email}','${password}') RETURNING id`)

    //  await pool.query("INSERT INTO users(username,email,password) VALUES('"+ username +"','"+ email +"','"+ password+"')");


     res.json({
        message: "signup done",
         id : response.row[0].id
    });

});

app.post('/signin',async(req,res)=>{
     const {email,password} = req.body;

     const response = await pool.query
     ("SELECT * FROM users WHERE email='$1 AND password=$2",
        [email,password]
     );

     const userExist = response.row[0];

     if(!userExist){
        return res.status(403).json({
            message:"incorrect credentials"
        })
     };
     
     const token = JWT.sign({
        userId : userExist.id
     },"secretkey");
     
     res.json({
        token : token
     })



})

app.listen(3000);