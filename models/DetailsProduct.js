// models/ProductDetails.js
import mongoose from 'mongoose';

const ProductDetailsSchema = new mongoose.Schema({
  sex: {
    type: String,
    enum: ['men', 'women', 'both'],
    required: true,
  },
  realPrice: {
    type: Number,
    required: true,
  },
  ttcPrice: {
    type: Number,
    required: true,
  },
  CategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stock',
    required: true,
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  size: {
    type: [String],
     required: true,
  },
  color: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }
}, { timestamps: true });

const ProductDetails = mongoose.models.ProductDetails || mongoose.model('ProductDetails', ProductDetailsSchema);

export default ProductDetails;
