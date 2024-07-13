// models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  img_url: {
    type: String,  // Add this field
    default: '',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
