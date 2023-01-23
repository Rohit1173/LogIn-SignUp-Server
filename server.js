const express = require('express')
const mongoose = require('mongoose')
const User = require('./user')
const bodyParser = require("body-parser");
const cors = require('cors');
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt")


require("dotenv").config();
require("dotenv/config");

const maxAge =3*24*60*60
const app = express()
const port = 3000
app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

mongoose.set('strictQuery', true);

const connectDatabase = async () => {
  try {    
    await mongoose.connect(process.env.DATABASE);

    console.log("connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

connectDatabase();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/login',async (req, res) => {
  try{
    let userName= req.body.userName
    let userPassword= req.body.userPassword
    let user=await User.findOne({userName:userName});
  
    if(user===null){
      res.status(404).json({status: 0,message:"User not found"})
    }
    
    if(bcrypt.compare(userPassword,user.userPassword)){
      const payload = {userName:userName,userPassword:userPassword} ;
    const secret = process.env.SECRET_KEY;
    const options = { expiresIn:maxAge };
    const token = jwt.sign(payload, secret, options);
    // Send response
    res.status(200).json({status: 1, message: token});
    }
    else{
      res.status(404).json({status: 0,message:"Incorrect Password"})
    }

  }
  catch(err){
    console.error(err);
    res.status(400).json({status: 0, message: err});
  }

})
app.post('/signup', async (req, res) => {
  try{
    let userName = req.body.userName
    let userEmail = req.body.userEmail
    let userPassword = req.body.userPassword
    console.log(req.body)
    let x=await User.findOne({userName: userName});
    let y=await User.findOne({userEmail: userEmail});
    if(x!==null){
      res.status(404).json({status: 0,message:"UserName Already Exists"})
    }
    if(y!==null){
      res.status(404).json({status: 0,message:"E-mail Already Exists"})
    }
    User.create(req.body,(err, user)=>{
      if(err){
        console.log(err.message);
        res.status(400).json({status:0,message:err.message});
      }
      const payload = {userName:userName,userPassword:userPassword} ;
               const secret = process.env.SECRET_KEY;
               const options = { expiresIn:maxAge };
               const token = jwt.sign(payload, secret, options);
               // Send response
               res.status(200).json({status: 1, message: token});
    })
  }
  catch(err){
    console.error(err.message);
    res.status(400).json({status: 0, message: err.message});
  }

})

app.get("/jwt",(req, res) => {
    try{
      let secretKey=process.env.SECRET_KEY
      const token = req.get("auth-token");
      const verfied=jwt.verify(token,secretKey);
      if(verfied){
        return res.status(200).json({status: 1, message: "SUCCESSFULLY VERIFIED"});
        }else{
            return res.status(401).json({status: 0, message: "NOT VERFIED"});
        }
    } catch (error) {
        return res.status(401).json({status: 0, message: ERR});
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

module.exports=app;