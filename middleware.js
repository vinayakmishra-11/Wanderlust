

        // module.exports.isLogedIn =(req,res,next) => {
        //     if(!req.isAuthenticated()){
        //         req.session.redirectUrl = req.originalUrl;
        //     req.flash("error","you must loged in to create");
        //    return res.redirect("/login");
        // }
        // next();
        // }
        const ExpressError = require("./utils/ExpressError.js")
const { listingSchema } = require("./schema.js"); // Add schema import
       const Listing = require("./models/listing.js");
       const Review = require("./models/review.js"); // Changed from 'rewive'
       const { reviewSchema } = require("./schema.js");
      module.exports.isLogedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Save the URL user is trying to access
        req.session.redirectUrl=req.originalUrl;
        req.flash("error", "You must be logged in first");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl =(req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to modify this listing");
        return res.redirect(`/listings/${id}`);
    }
    
    next(); // Don't forget to call next() if authorization passes
};


module.exports.validateListing = (req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errorMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errorMsg);
    }else{
        next();
    }
}


module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params; // Fix: Changed ReviewId to reviewId
    let review = await Review.findById(reviewId);
    
    if (!review) {
        req.flash("error", "Review not found");
        return res.redirect(`/listings/${id}`);
    }
    
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You don't have permission to delete this review");
        return res.redirect(`/listings/${id}`);
    }
    
    next();
};

module.exports.validateReview  = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errorMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errorMsg);
    } else {
        next();
    }
};