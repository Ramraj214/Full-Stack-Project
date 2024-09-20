const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync")
const {validateReview, isLoggedIn,isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//add review
router.post("/", 
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
);

//delete route for review
router.delete("/:reviewId",
    isReviewAuthor,
    isLoggedIn,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;