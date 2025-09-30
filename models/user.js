const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalm = require("passport-local-mongoose");

const userSchema = new Schema ({
  email : {
    type : String,
    required :true
  }

})
 userSchema.plugin(passportLocalm);

 const User = mongoose.model("User", userSchema);

module.exports = User;