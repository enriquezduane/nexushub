const mongoose = require('mongoose');
const Board = require('./boardModel');

const categorySchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  id: Number,
  title: String,
  boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
