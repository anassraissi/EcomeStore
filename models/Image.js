import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  urls: {
    type: [String], // Array of image URLs
    required: true,
  },
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  type: {
    type: String,
    enum: ['product', 'category' , 'brand'],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.models.Image || mongoose.model('Image', imageSchema);
export default Image;
  