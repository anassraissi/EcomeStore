import mongoose from 'mongoose';

const DetailProductSchema = new mongoose.Schema({
  descriptionProduct: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    enum: ['Men', 'Women', 'Both'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  colors: {
    type: [String], // Array of colors
    required: true,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image', // Reference to the Image model
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const DetailProduct = mongoose.models.DetailProduct || mongoose.model('DetailProduct', DetailProductSchema);
export default DetailProduct;
