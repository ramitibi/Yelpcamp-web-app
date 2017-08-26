var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var User = require("../models/user");
var passport    = require("passport");

router.get("/",function(req,res){
    res.render("landing");
});

//=================================
// AUTH ROUTES
//=================================

//show the register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//hanlde sign up logic
router.post("/register",function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//handle login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }),function(req, res) {
    }
);


// add logout route
router.get("/logout",function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
})

function isLoggedIn(req, res, next){
    console.log(req);
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;