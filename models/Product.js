import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sex: {
    type: String,
    enum: ['men', 'women', 'both'],  // Enum for allowed values
    required: true,
  },
  colors: [
    {
      color: {
        type: String,
        required: true,
      },
      stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock', // Reference to the Stock model
        required: true,
      },
      images: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Image', // Reference to the Image model
          required: true,
        },
      ],
    },
  ],
  details: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DetailProduct',
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
