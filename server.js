const express = require('express')
const mongoose = require('mongoose')
const User = require('./user')
const ip=require('ip')
const bodyParser = require("body-parser");

require("dotenv").config();
require("dotenv/config");


const app = express()
const port = 3000

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true }, () => {
  console.log("Connected to MongoDB");
});



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
    if(user.userPassword!==userPassword){
      res.status(404).json({status: 0,message:"Incorrect Password"})
    }
    res.status(200).json({status: 0,message:"Logged In!"})

  }
  catch(err){
    console.error(err);
    res.status(400).json({status: 0, message: error});
  }

})
app.post('/signup', async (req, res) => {
  try{
    let userName = req.body.userName
    let userEmail = req.body.userEmail
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
        console.log(err);
        res.status(400).json({status:0,message:err.message});
      }
      res.status(200).json({status:1,message:"Success"});
    })
  }
  catch(err){
    console.error(err);
    res.status(400).json({status: 0, message: error});
  }

})

app.listen(port, () => {
  console.log(`Server running at http://${ip.address()}:${port}`);
});

module.exports=app;