if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapAsync.js");
const {listingSchema,reviewSchema} = require("./schema.js")
const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const seesion =require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const port = 3000;

const dburl = process.env.ATLASDB;
// Middleware
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const reviewRoutes = require("./routes/review.js");
const userroutes = require("./routes/user.js");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/user.js");


const ExpressError = require("./utils/ExpressError.js")

// MongoDB connection
async function main() {
    try {
        await mongoose.connect(dburl);
        console.log("✅ Connected to DB");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}
main();
const store = MongoStore.create({
    mongoUrl : dburl,
    crypto :{
        secret:process.env.SECRET,
    },
    touchAfter : 24*3600,
});
store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE ",err);
})
const sessionOption ={
    store ,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly :true,
    },
};


// Routes
// ...existing code...
// Routes



app.get("/", (req, res) => {
    res.redirect("/listings");
});
// ...existing code...
app.use(seesion(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success =req.flash("success");
     res.locals.error =req.flash("error");
     res.locals.currentUser = req.user;
    next();
})

// app.get("/demouser", async (req,res)=>{
//    let fakeuser = new user({
//     email : "Student@gmail.com",
//     username : "Demoa hai bhai"
//    });
//    let registeruser  = await user.register(fakeuser,"helloworld");
//    res.send(registeruser);
// })



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/",userroutes);



app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});
 app.use((err,req,res,next)=>{

    let {statusCode =500 , message="Something went wrong "} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
 })
// Start server
app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
//reviews post route

