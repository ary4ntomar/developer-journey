const express = require("express");
const {Pool} = require('pg');
const JWT = require("jsonwebtoken");
const z = require("zod");
const {authMiddleware}= require("./middleware");
const bcrypt = require("bcrypt");

const pool = new Pool({
    connectionString:"postgresq-url"
})

const app = express();
app.use(express.json());

const signupSchema = z.object({
   username : z.string().max(20),
   password : z.string().min(8),
   email : z.string().email()
})

const signinSchema = z.object({
   email : z.string().email(),
   password : z.string().min(8)
})

app.post('/signup',async(req,res)=>{

     const{data,success,error} =signupSchema.safeParse(req.body);
     if(!success){
       return res.status(403).json({
         message:"incorrect credentials",
         error : error
      })
     }
     const {username ,email, password} = data; // data = req.body

     const hashedPassword = await bcrypt.hash(password,10);

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
      ,[username,email,hashedPassword]
    )

     //a very bad ways to do sql using PG ---this is vulnerable to sql injection
    
     //  await pool.query(`INSERT INTO users(username,email,password) VALUES('${username}','${email}','${password}') RETURNING id`)

    //  await pool.query("INSERT INTO users(username,email,password) VALUES('"+ username +"','"+ email +"','"+ password+"')");


     res.json({
        message: "signup done",
         id : response.rows[0].id
    });

});

app.post('/signin',async(req,res)=>{

    const {data,success,error} = signinSchema.safeParse(req.body);

    if(!success){
      return res.status(400).json({
         message:"invalid input",
         error : error
      })
    }
    const {email,password} = data;

    const response = await pool.query
       ("SELECT * FROM users WHERE email= $1",
       [email]
       );

    const userExist = response.rows[0];

    if(!userExist){
       return res.status(403).json({
       message:"incorrect credentials"
       })
     } 
   
    const correctPassword = await bcrypt.compare(password,userExist.password);

    if(correctPassword){
       
    const token = JWT.sign({
       userId : userExist.id
       },"secretkey");
     
    res.json({   
      token : token 
     })
   }
    else{
       return res.status(403).json({
       message:"incorrect credentials"
        })
    }

})

app.listen(3000);