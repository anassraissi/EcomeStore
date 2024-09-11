import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Stock from '../../../../models/Stock';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parsing
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PUT') { // Update operation
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public', 'images', 'uploads', 'products'),
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(500).json({ success: false, error: 'Form parsing error' });
      }

      const {
        name,
        category,
        brand,
        userId,
        tags,
        description,
        features,
        specifications,
        price,
        weight,
        dimensions = '{}',
        shippingOptions = '[]',
        } = fields;
        console.log(fields);
        
        
        try {
          const productId = req.query.id; // Assuming you're passing the product ID in the query params
          const product = await Product.findById(productId);
          if (!product) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Update basic fields
        product.name = name[0];
        product.category = category[0];
        product.brand = brand[0];
        product.userId = userId[0];
        product.tags = tags[0];
        product.description = description[0];
        product.features = features[0];
        product.specifications = specifications[0];
        product.price = price[0];
        product.weight = weight[0];
        product.dimensions = JSON.parse(dimensions[0]);
        product.shippingOptions = JSON.parse(shippingOptions[0]);
        
        // Handle colors and stock updates
        const colors = [];
        for (const key in fields) {
          if (key.startsWith('colors[')) {
            const match = key.match(/colors\[(\d+)\]\[(\w+)\]/);
            if (match) {
              const index = parseInt(match[1], 10);
              const fieldName = match[2];
              if (!colors[index]) {
                colors[index] = {};
              }
              colors[index][fieldName] = fields[key][0];
            }
          }
        }

        // Update the stock for each color
        for (const colorData of colors) {
          const existingStock = await Stock.findOne({
            product: productId,
            color: colorData.color,
          });

          if (existingStock) {
            // Make sure you're only setting the stock to the new value
            const newQuantity = parseInt(colorData.stock, 10);
            console.log(`Updating stock for color ${colorData.color}: ${existingStock.quantity} -> ${newQuantity}`);
            existingStock.quantity = newQuantity;  // No calculation, just set it
            await existingStock.save();
          } else {
            // If the stock for the color doesn't exist, create new stock
            const newStock = new Stock({
              product: productId,
              color: colorData.color,
              quantity: parseInt(colorData.stock, 10),
              userId: userId[0],
            });
            await newStock.save();
          }
        }

        await product.save();

        return res.status(200).json({ success: true, data: product });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, error: `Database error: ${error.message}` });
      }
    });
  } else {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
