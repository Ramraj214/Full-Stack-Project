const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        category: Joi.object({
            type: Joi.string().valid('Trending', 'Beachfront', 'Rooms', 'Farms', 'New', 'Arctic','iconic-cities','Mountains','Castles').required()
        }).required(),
        image: Joi.object({
            filename: Joi.string().optional(),
            url: Joi.string().uri().optional() // Ensure the URL is valid
        }).optional()
    }).required()
});



// Joi schema for validating Review data
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        comment: Joi.string().required(),
        rating: Joi.number().required().min(1).max(5),
    }).required()
})