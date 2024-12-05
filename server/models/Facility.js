const mongoose = require('mongoose');

const FacilitySchema = new mongoose.Schema({
  name: String,
  category: String,
  address: String,
  contact: String,
  latitude: Number,
  longitude: Number,
});

module.exports = mongoose.model('Facility', FacilitySchema);
