import mongoose from 'mongoose';

const detailProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: [String],
  specifications: [String],
  price: {
    type: Number,
    required: true,
  },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  shippingOptions: [{
    name: {
      type: String,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    estimatedDeliveryTime: {
      type: String,
      required: true,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const DetailProduct = mongoose.models.DetailProduct || mongoose.model('DetailProduct', detailProductSchema);

export default DetailProduct;
