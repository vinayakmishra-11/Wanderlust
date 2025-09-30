const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js")


const dburl = process.env.ATLASDB;
const mongourl = "mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(mongourl)
}

main().then(()=>{
    console.log("Connect to db");
}).catch((err)=>{
    console.log(err);
})


const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=>({...obj , owner : "68cfe4f17d618c6a3bd5c670"}))
    await Listing.insertMany(initdata.data);

    console.log("data was inititalezed");

}

initDB();