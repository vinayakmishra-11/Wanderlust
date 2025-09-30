const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
 const mapToken = process.env.MAP_TOKEN;

 const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req, res,next) => {
    const alllistng = await Listing.find({});
    res.render("listings/index", { alllistng });
}

module.exports.rendernewform = (req, res) => {
    res.render("listings/new");
};

module.exports.showroute = (async (req, res,next) => {
    let { id } = req.params;
    const l = await Listing.findById(id).
    populate({path :'reviews', populate :{
        path : "author",
    } }).populate('owner');
    if(!l){
        req.flash("error","Listing you are try to find does not exist  ");
        return res.redirect("/listings");
    }
   
    res.render("listings/show", { l });
})

module.exports.create = (async (req, res, next) => {

 let response =  await   geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send();

    let url = req.file.path;
    let filename = req.file.filename;
   
    // if (!req.body.listing.image.url) {
    //     req.body.listing.image.url = "https://plus.unsplash.com/premium_photo-1676497581000-763997b7c457?q=80...";
    // }

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing. geometry =  response.body.features[0].geometry;
    let savedlisting =await newListing.save();
    console.log(savedlisting);
    req.flash("success", "New Listed created");
    res.redirect(`/listings`);
})

module.exports.edit = async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you are try to find does not exist  ");
        res.redirect("/listings");
    }
   let originalimage =listing.image.url;
   originalimage =originalimage.replace("/upload","/upload/w_250");
    res.render("listings/edit", { listing,originalimage });
}

module.exports.update = async (req, res,next) => {
    let { id } = req.params;
   let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if ( typeof req.file!=='undefined'){
     let url = req.file.path;
    let filename = req.file.filename;
    listing.image= { url, filename};
    await listing.save();
  }
    req.flash("success","Listed Updated ");
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res,next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listed Deleted");
    res.redirect("/listings");
}