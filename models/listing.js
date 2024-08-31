const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  position: {
    type: {
      type: String,
      enum: ["Point"], // Must be 'Point' for GeoJSON
      required: true,
    },
    coordinates: {
      type: [Number], // Array of numbers: [longitude, latitude]
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the current date/time
  },
  category: {
    type: String,
    enum: [
      'Rooms',
      'Mountains',
      'Castles',
      'Camping',
      'Arctic',
      'Farms',
      'Domes',
      'Boats',
      'Cities',
      'Beach',
      'Temple',
      'Pools',
    ], // Add more categories as needed
    required: true,
  },
  views: {
    type: Number,
    default: 0, // Track the number of views
  },
});

// listingSchema.post('findOneAndDelete', async (listing) => {
//     if (listing) {
//         await Review.deleteMany({ _id: { $in: listing.reviews } });
//     }
// });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
