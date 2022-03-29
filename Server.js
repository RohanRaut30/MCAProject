const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
require("./server/database/conn");
const Register = require("./server/models/registers");
const { rmSync } = require("fs");

const port = process.env.port || 3000;

// app.use(express.json());
// app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json())
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
   extended:true
}))

app.get("/",(req,res)=> {
   res.render("index");
})
app.get("/admin",(req,res)=> {
   res.render("admin");
})

app.get("/login",(req,res)=> {
   res.render("Login_Page");
})

app.get("/register",(req, res)=>{
   res.render("index");
})

// SignUp code
app.post("/sign_up", async(req,res)=> {
   try{
      const password = req.body.password;
      const ConfirmPassword = req.body.ConfirmPassword;
      if(password === ConfirmPassword){
         const registerusers = new Register({
            name: req.body.name,
            email: req.body.email,
            password: password,
            ConfirmPassword: ConfirmPassword
         })

         const registered = await registerusers.save();
         res.status(201).sendFile(__dirname + '/public/Login_Page.html');
         
      }else{
         res.send("Invalid Password")
      }

   }catch(error) {
      res.status(400).send(error);
   }
})

//login 

app.post("/login", async(req,res)=> {
   try{
        const email = req.body.email;
        const password = req.body.password;
        const useremail = await Register.findOne({email:email});

         if(useremail.password === password){
            res.status(201).sendFile(__dirname + '/public/ChargeingMode.html');
         }else{
            res.send("Invalid Password");          
         }    
   } catch(error){
      res.status(400).send("invalid Login Details")
   }
 
})

app.listen(port,()=>{
   console.log(`Server is running on http://localhost:${port}`)
});