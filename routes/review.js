// routes/review.js
const express = require("express");
const router = express.Router({ mergeParams: true });
const {isReviewAuthor, isLogedIn,validateReview } = require("../middleware.js"); 
// mergeParams is crucial here because reviews are nested under /listings/:id

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");
const reviwcontroller = require("../controllers/review.js");

// Middleware for validation
// const validateReview = (req, res, next) => {
//     let { error } = reviewSchema.validate(req.body);
//     if (error) {
//         let errorMsg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400, errorMsg);
//     } else {
//         next();
//     }
// };

// POST: Create Review
router.post("/",isLogedIn, validateReview, wrapAsync(reviwcontroller.createReive));

// DELETE: Remove Review
router.delete("/:reviewId",isLogedIn,isReviewAuthor,wrapAsync(reviwcontroller.deleteReview));

module.exports = router;
