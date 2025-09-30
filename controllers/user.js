const express = require("express");
const router = express.Router();
const usermodel = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


module.exports.getsignup =(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.postsignup = async(req,res)=>{
    try{
        let { username , email , password } = req.body;
     const newuser =    new usermodel({email , username});
   const registeruser=  await  usermodel.register(newuser,password);
   console.log(registeruser);
   req.login(registeruser,(err)=>{
    if(err){
        return next(err);
    }
    else{
        req.flash("success","Welcome to wanderlust");
  res.redirect("/listings");
    }
   })
   
    } catch(e){
            req.flash("error",e.message);
            res.redirect("/signup");
    }
    
}

module.exports.getlogin = (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postlogin =[ saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect: "/login",
        failureFlash : true ,
    }),
     (req,res) =>{
       req.flash("success","Successfully loged in you are")
       let redirectUrl =res.locals.redirectUrl || "/listings";
       res.redirect( redirectUrl);
    }
]

    module.exports.getlogout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        else {
            req.flash("success","Ypu are logout");
            res.redirect("/listings");
        }
    });
}