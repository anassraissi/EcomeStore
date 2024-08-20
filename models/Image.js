import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  urls: {
    type: [String],
    required: true,
  },
  refId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product' // or 'Category' depending on your use case
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['product', 'category','brand'],
    required: true,
  },
});

export default mongoose.models.Image || mongoose.model('Image', imageSchema);
