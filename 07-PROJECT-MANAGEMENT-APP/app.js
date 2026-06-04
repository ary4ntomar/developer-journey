require("dotenv").config();
const express = require ("express");                 //helps to use express in our codebase
const app = express();
const JWT = require("jsonwebtoken")                  //helps to use JWT in our codebase
const { authMiddleware } = require("./middleware");   //import middleware.js properties into this file
const cors = require("cors");
const{userModel ,organizationModel,boardModel,issueModel} = require("./database/models");
const { default: mongoose } = require("mongoose");

app.use(express.json());                             //converts incoming JSON into JavaScript object
app.use(cors());


//............... Create Endpoints(routes) ...............

app.post("/signup",async (req,res)=>{

    //take username and pass from body
    const username = req.body.username ;
    const password = req.body.password ;

    //check if user already exists or not 
    const userExist = await userModel.findOne({
        username : username
    })

    //if exists then return error 
    if( userExist){
         return res.status(403).json({
            message : " user already exist"
        })
    }

    //if not then store user in Database
    const newUser = await userModel.create({
        username: username,
        password: password
    })

     //Send Success Response
     res.json({
        id : newUser._id,
        message : "You have signed up !!"
     })

});

app.post("/signin",async(req,res)=>{

    //take username and pass from the body
    const username = req.body.username;
    const password = req.body.password;

    //find user in database and check if the password is correct or not
    const userExist = await userModel.findOne({
        username : username,
        password : password
    })

    //if wrong then return incorrect credentials
    if(!userExist){
        return res.status(403).json({
            message : "Incorrect credentials"
        })
    }

    //if correct then generate JWT token --- JWT.sign(...) -->> generates token string --> stored inside variable called token
     const token = JWT.sign({  
           userId : userExist._id 
     } ,process.env.JWT_SECRET)   

     //send token in response to the frontend
     res.json({
     token : token
    })
});
app.post("/organization", authMiddleware , async (req,res)=>{

    const newOrganization = await organizationModel.create({
        title : req.body.title,
        description : req.body.description,
        admin : req.userId,
        members :[]
    })

    res.json({
        message : "org created",
        id : newOrganization._id
    })

});

app.post("/add-member-to-organization",authMiddleware, async (req,res)=>{ //who is making req , middleware gives userId
     const organizationId =  req.body.organizationId ; //which organization should i add member to ?
     const memberUsername = req.body.memberUsername ; //which user to add?

     //find organization
     const Organization = await organizationModel.findOne({
            _id : organizationId
     })

     //check admin / if org not exist
     if(!Organization ||!Organization.admin.equals(req.userId)){
         return res.status(403).json({
            message : "Either Org dosen't exist or User isn't admin "
        })
     }
     //find member user
     const memberUser =  await userModel.findOne({
         username : memberUsername
     })

     //if not exist
     if(!memberUser){
         return res.status(403).json({
            message :" user dosen't exist in out Database"
        })
     }
    await organizationModel.updateOne(
        {
            _id : organizationId
        },
        {
            $push:{
                members: memberUser._id 
              }
        }
    );

     //send success message
     res.json({
        message : "New Member added"
     })

});

app.post("/boards",authMiddleware,async (req,res)=>{
        
        //get data from user
        const title =  req.body.title ;
        const orgId = req.body.organizationId ;

        //find organization
        const org = await organizationModel.findOne({
            _id : orgId
        })

        //if org not found
        if(!org){
             res.status(403).json({
            message :"Org dosen't exist "
        })
        return
        }
        //if found then create board and push data into board array
         await boardModel.create({
            title : title ,
             organizationId : orgId
        })

        //send success response
        res.json({
            message:"Board created successfully"
        })
});

app.post("/issue",authMiddleware,async(req,res)=>{
         //extract data from body
        const title = req.body.title;
        const boardId = req.body.boardId;
        // const status = req.body.status ;
        const assignedTo = req.body.assignedTo ;

        //find board in which issue is there
        const myBoard = await boardModel.findById(boardId);

        //if not found
        if(!myBoard){
        res.status(403).json({
            message : " Board not found"
        })
        return
    }
        //check if assigend user exist or not
        // const assignedUser = users.find( user => user.username === assignedTo);
        const assignedUser = await userModel.findOne({
            username : assignedTo
        })

        //if not exist 
        if(!assignedUser){
            return res.status(403).json({
                message : "User does  not exist"
            })
        }
        
        //check if user belongs to the org of board
        const myOrg = await organizationModel.findById(
            myBoard.organizationId
        );

          if (!myOrg) {
         return res.status(404).json({
        message: "organization not found"
           });
         }
          
        if(!myOrg.members.some( member =>
             member.equals(assignedUser._id)
            )
        ){
              return res.status(403).json({
                message:" user does not belong to the board of Org"
            })
        }

        await issueModel.create({
            title : title,
            boardId : boardId,
            assignedTo : assignedUser._id
        })

        //sucess response
        res.json({
            message :"Issues added successfully"
        })
});

//................ Read Endpoints ..................

app.get("/my-organizations",authMiddleware,async (req,res)=>{

      const myOrgs = await organizationModel.find({
         $or :[ 
            {admin : req.userId} ,
          {members : req.userId}
         ]
      }) 

      res.json({
        myOrgs : myOrgs
      })
})

app.get("/organization",authMiddleware , async (req,res)=>{
    //user send org id
     const organizationId = req.query.organizationId ;

     //find that org from DB
     const Organization = await organizationModel
     .findById(organizationId)
     .populate("members","username");

     if(!Organization || !Organization.admin.equals(req.userId)){
        res.status(403).json({
                message : "Either org dosen't exist or you aren't the admin of org"
        })
        return 
     }

    res.json({
        Organization : Organization
    })
})

app.get("/boards",authMiddleware,async(req,res)=>{
    //extract organization id from query
   const organizationId = req.query.organizationId;

   //find all the boards belonging to that org
   const allBoards = await boardModel.find({
        organizationId : organizationId
   })

   //return boards
   return res.json({
      boards : allBoards
   })

});

app.get("/issues",authMiddleware,async(req,res)=>{
         //extract board id for which you looking for
         const boardId= req.query.boardId ;
         
         //extract all the issues belonging to that board
         const allIssues =  await issueModel.find({
            boardId : boardId
         })

         //return all the issues belonging to that board
         return res.json({
            issues : allIssues
          })
});

app.get("/members",authMiddleware, async (req,res)=>{
       //extract issue id
       const issueId = req.query.issueId;

       //find issue
       const myIssue = await issueModel.findById(issueId);

       if(!myIssue){
        return res.status(404).json({
           message:"issue not found"
        });
       }

       //find assigned user
       const assignedUsers = await userModel.findById(myIssue.assignedTo);
        
       if(!assignedUsers){
        return res.status(404).json({
            message:"user not found"
        })
       }

        
     return res.json({
             members : [{
                username : assignedUsers.username
           }]
       });
    })
//................. Update Endpoints ..................

app.put("/issues",authMiddleware,async(req,res)=>{
       const issueid = req.query.issueId;
       const issueExist =  await issueModel.findById(issueid);
       if(!issueExist){
        return res.status(404).json({
            message:"Isuue not found"
        })
       }
       const currentStatus = issueExist.status

       if(currentStatus =="upnext"){
            issueExist.status ="inprogress"
       }
       else if(currentStatus =="inprogress"){
           issueExist.status ="done"
       } 
      await issueExist.save();

       res.json({
          message:"Status chenged successfully"
       })
});


//................ Delete Endpoints ...................

app.delete("/members",authMiddleware, async(req,res)=>{
       

     const organizationId =  req.body.organizationId ; //which organization should i add member to ?
     const memberUsername = req.body.memberUsername ; //which user to add?

     //find organization
     const Organization = await organizationModel.findById(organizationId);

     //check admin / if org not exist
     if(!Organization || !Organization.admin.equals(req.userId)){
         return res.status(403).json({
            message : "Either Org dosen't exist or User isn't admin "
        })
     }
     //find member user
     const memberUser = await userModel.findOne({
        username : memberUsername
     })

     //if not exist
     if(!memberUser){
         return res.status(403).json({
            message :" user dosen't exist in out Database"
        })
     }
     //if exist then delete

     await organizationModel.updateOne({
        _id : organizationId
     },{
        $pull:{
            members : memberUser._id
        }
     }
    )

     //send success message
     res.json({
        message : " Member Removed from Org"
     })
});

app.listen(3000);