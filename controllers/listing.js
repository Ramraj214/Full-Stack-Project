const { response } = require("express");
const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews", populate: {
                path: "author"
            }
        }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings")
    }
    let response = await geocodingClient.forwardGeocode({
        query: listing.location,
        limit: 1
    }).send();
    listing.geometry = response.body.features[0].geometry;
    await listing.save();
    res.render("listings/show.ejs", { listing });
}

module.exports.showListingsByCategory = async (req, res) => {
    const { category } = req.params;
    const listings = await Listing.find({ "category.type": new RegExp(category, 'i') })
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listings.length) {
        req.flash("error", "No listings found for this category");
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings: listings, category });
};

module.exports.showListingsByCountry = async (req, res) => {
    const { country } = req.query;

    // Check if country is an array and use the first element
    const countryValue = Array.isArray(country) ? country[0] : country;

    // Ensure it's a string and not empty
    if (typeof countryValue !== 'string' || countryValue === "") {
        req.flash("error", "Please provide a valid country.");
        return res.redirect("/listings");
    }

    // Proceed with the database query
    const listings = await Listing.find({
        country: new RegExp(countryValue, 'i')
    })
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner"); 

    if (!listings.length) {
        req.flash("error", `No listings found in country: ${countryValue}`);
        return res.redirect("/listings");
    }

    res.render("listings/index.ejs", { allListings: listings, country: countryValue });
};

module.exports.createListing = async (req, res, next) => {
    console.log(req.body);
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.category = req.body.listing.category; // This is correct
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("updated", "Listing was updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("deleted", "Listing Deleted!");
    res.redirect("/listings");
}