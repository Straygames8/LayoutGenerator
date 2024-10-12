// models/Layout.js
const mongoose = require('mongoose');

const DrawingSchema = new mongoose.Schema({
  name: String,
  url: String,
});

const SheetSchema = new mongoose.Schema({
  name: String,
  size: String,
  drawings: [DrawingSchema],
});

const LayoutSchema = new mongoose.Schema({
  name: String,
  sheets: [SheetSchema],
});

module.exports = mongoose.model('Layout', LayoutSchema);