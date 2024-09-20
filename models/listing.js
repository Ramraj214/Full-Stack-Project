const mongoose = require("mongoose");
const Review = require("./review");
const { required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    geometry :{
        type :
        {
            type : String,
            enum : ['Point'],
        },
        coordinates : {
            type : [Number],
            required : true
        },
    },
    category: {
        type: {
            type: String,
            enum: ["Trending", "Beachfront", "Rooms", "Farms", "New","Arctic","iconic-cities",'Mountains','Castles'],
            required: true  // Make sure this is set to trueArctic
        }
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const listing = mongoose.model("listing", listingSchema);
module.exports = listing;
