// models/Stock.js
import mongoose from 'mongoose';

const StockSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  }
}, { timestamps: true });

const Stock = mongoose.models.Stock || mongoose.model('Stock', StockSchema);

export default Stock;
