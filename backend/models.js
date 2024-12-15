const mongoose = require('mongoose');

// Define the Movie schema
const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  genre: { type: String, required: true },
  year: { type: Number, required: true },
});

// Export the model
module.exports = mongoose.model('Movie', movieSchema);
