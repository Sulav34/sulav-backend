const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    trim: true,
  },
  categoryID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

subCategorySchema.pre('save', function (next) {
  this.name = this.name[0].toUpperCase() + this.name.substring(1);
  next();
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
