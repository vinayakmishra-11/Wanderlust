const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogedIn, isOwner, validateListing } = require("../middleware.js");
const listingcontroler = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../CloudConfig.js");
const upload = multer({storage});
// Index & Create routes (same path "/listings")
router.route("/")
  .get(wrapAsync(listingcontroler.index))                          // GET /listings
  .post(
    upload.single('listing[image]'),
    wrapAsync(listingcontroler.create));      // POST /listings
   
// New listing form (cannot be in router.route because path is different)
router.get("/new", isLogedIn, listingcontroler.rendernewform);

// Show, Update, Delete routes for specific listing
router.route("/:id")
  .get(wrapAsync(listingcontroler.showroute))                     // GET /listings/:id
  .put(
    isLogedIn, 
    isOwner,
     upload.single('listing[image]'),
     validateListing, 
     wrapAsync(listingcontroler.update)
    )   // PUT /listings/:id
  .delete(isLogedIn, isOwner, wrapAsync(listingcontroler.delete));                // DELETE /listings/:id

// Edit route (cannot be chained in router.route because path is "/:id/edit")
router.get("/:id/edit", isLogedIn, isOwner, wrapAsync(listingcontroler.edit));

module.exports = router;
