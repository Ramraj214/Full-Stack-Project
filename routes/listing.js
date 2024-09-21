const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const listingController = require("../controllers/listing.js");

// Index Route, Create
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    );

// New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.locals.currentPage = '/new'; // Set currentPage
    listingController.renderNewForm(req, res);
});

router.route("/category/:category")
    .get(wrapAsync(listingController.showListingsByCategory));

router.route("/country")
    .get(wrapAsync(listingController.showListingsByCountry));

// Show Route, Delete Route, Update Route
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, (req, res) => {
    res.locals.currentPage = '/edit'; // Set currentPage
    listingController.renderEditForm(req, res);
});

module.exports = router;
