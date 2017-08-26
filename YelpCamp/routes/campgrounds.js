var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
});

//create
router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCamp = {name:name, price:price, image:image, description:description, author:author};
    Campground.create(newCamp,function(err,camp){
        if(err)
            console.log("Error, faield to add new camp");
        else{
            
            console.log("Add new camp Success!");
        }
    });
    res.redirect("campgrounds");
});

//NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new.ejs"); 
});

//SHOW
router.get("/:id",function(req, res) {
    //find the Campground by Id
    var id = req.params.id;
    Campground.findById(req.params.id).populate("comments").exec(function(err,camp){
        if(err){
            console.log("faield to get camp by id")
        }
        else{
            res.render("campgrounds/show", {campground:camp});
        }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err,found){
        if(err)
            res.redirect("/campgrounds");
        else{
            res.render("campgrounds/edit",{campground: found});
        }
    });
});


// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req,res){
    // find and update the correct camground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
        if(err)
            res.redirect("/campgrounds");
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    // redirect to page 
});

//DESTROY CAMPGROUND ROUTE
router.delete("/", middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;