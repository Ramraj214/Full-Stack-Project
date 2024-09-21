const Listing = require("./models/listing");
const Review = require("./models/review");
const expressError = require("./utils/expressError.js");
const { listingSchema ,reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =  req.session.redirectUrl
    }
    next();
}

module.exports.isOwner=async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing=(req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new expressError(400, message);
    } else {
        next();
    }
};

// Validation middleware using Joi for review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const message = error.details.map(el => el.message).join(',');
        throw new expressError(400, message);
    } else {
        next();
    }
};

module.exports.isReviewAuthor=async(req,res,next)=>{
    let { id,reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// middleware/currentPath.js
module.exports.currentPath = (req, res, next) => {
    res.locals.currPath = req.path; // Store the current path
    next();
};
