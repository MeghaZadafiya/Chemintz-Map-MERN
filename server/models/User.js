const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteFacility: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility' },
  homeAddress: { type: String },
  deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', UserSchema);
