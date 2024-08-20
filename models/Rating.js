import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  averageRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 0,
  },
  numberOfRatings: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Rating = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);
export default Rating;
