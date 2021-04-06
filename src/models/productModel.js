const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      unique: true,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    price: {
      type: Number,
      required: [true, 'Price must be included'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    description: {
      type: String,
      required: [true, 'A product must have description'],
      trim: true,
      text: true,
    },
    offer: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'A product must have category'],
    },
    // Sub-Category
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: [true, 'A product must have sub-category'],
    },
    // Child Category
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChildCategory',
      required: [true, 'A product must have child-category'],
    },
    rating: { type: Number, default: 0 },
    images: [{ img: { type: String } }],
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
      },
    ],
    numReviews: { type: Number, default: 0 },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    updatedAt: Date,
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {
    lower: true,
  });
  next();
});

module.exports = Product = mongoose.model('Product', productSchema);
