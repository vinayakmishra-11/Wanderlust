const mongoose = require("mongoose");
const schema = mongoose.Schema;
const rr = require("./review.js");
const { required } = require("joi");

const listingSchema = new schema({
title :{
    type:String,
    required:true
},
description : String,
image: {
   url : String,
   filename : String
}
,
price:Number,
location:String,
country :String,
reviews :[
    {
        type:  schema.Types.ObjectId,
        ref : "Review"
        
    },
],
owner : {
    type : schema.Types.ObjectId,
    ref : "User",
},
 geometry :{
    type :{
        type:String,
        enum :['Point'],
        required : true
    },
    coordinates : {
        type : [Number],
        required : true
    }
 }
});

listingSchema.post("findOneAndDelete",async(listing) =>{
   if(listing){
     await rr.deleteMany({_id :{$in:listing.reviews}});
   }
})

const listing = mongoose.model("Listing",listingSchema);
module.exports = listing;



