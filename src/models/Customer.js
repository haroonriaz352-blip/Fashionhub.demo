const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  instagramId: { type: String, required: true, unique: true },
  address: { type: String },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  preferences: {
    favoriteColors: [String],
    favoriteCategories: [String],
    budget: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);