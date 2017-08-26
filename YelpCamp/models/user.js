var mongoose = require("mongoose");
var passLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passLocalMongoose);

module.exports = mongoose.model("User",UserSchema);