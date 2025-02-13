const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true }, // Batsman, Bowler, etc.
  price: { type: Number, required: true, min: 0 },
  img: { type: String, required: true }, // Image URL
  rating: { type: Number, default: 0 }, // Stores the last given rating
  final_rating: { type: Number, default: 0 }, // Average rating
  rating_count: { type: Number, default: 0 }, // Number of ratings submitted
  dr: { type: Number, required: true }, // Stadium effect
  group2_id: { type: Number, required: true } // Stadium/Group ID
});

// Create a model from the schema
module.exports = mongoose.model("Player", playerSchema);
