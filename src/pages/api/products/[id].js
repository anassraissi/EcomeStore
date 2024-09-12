import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Stock from '../../../../models/Stock';
import DetailProduct from '../../../../models/DetailsProduct';
 
export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parsing
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PUT') {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public', 'images', 'uploads', 'products'),
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(500).json({ success: false, error: 'Form parsing error' });
      }

      try {
        const {
          name = [''],
          category = [''],
          brand = [''],
          userId = [''],
          tags = [''],
          description = [''],
          features = [''],
          specifications = [''],
          price = [''],
          weight = [''],
          sex = ['both'],
          dimensions = ['{}'],
          shippingOptions = ['[]'],
        } = fields;
        console.log(features[0].split(','));
        

        const productId = req.query.id;

        // Handle product update
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }

        product.name = name[0];
        product.category = category[0];
        product.brand = brand[0];
        product.userId = userId[0];
        product.tags = tags[0];
        product.description = description[0];
        product.price = parseFloat(price[0]);
        product.weight = parseFloat(weight[0]);
        product.dimensions = JSON.parse(dimensions[0]);
        product.shippingOptions = JSON.parse(shippingOptions[0]);
        product.sex = sex[0] || 'both';  // Default to 'both' if sex is not provided

        // Save or update DetailProduct
        let detailProduct = await DetailProduct.findOne({ product: productId });
        if (!detailProduct) {
          detailProduct = new DetailProduct({
            product: productId,
            description: description[0],
            features: features[0].split(','),
            specifications: specifications[0].split(','),
            price: parseFloat(price[0]),
            weight: parseFloat(weight[0]),
            dimensions: JSON.parse(dimensions[0]),
            shippingOptions: JSON.parse(shippingOptions[0]),
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else {
          detailProduct.description = description[0];
          detailProduct.features = features[0].split(',');
          detailProduct.specifications = specifications[0].split(',');
          detailProduct.price = parseFloat(price[0]);
          detailProduct.weight = parseFloat(weight[0]);
          detailProduct.dimensions = JSON.parse(dimensions[0]);
          detailProduct.shippingOptions = JSON.parse(shippingOptions[0]);
          detailProduct.updatedAt = new Date();
        }
        await detailProduct.save();

        // Handle colors and stock updates
        const colorsArray = [];
        for (const key in fields) {
          if (key.startsWith('colors[')) {
            const match = key.match(/colors\[(\d+)\]\[(\w+)\]/);
            if (match) {
              const index = parseInt(match[1], 10);
              const fieldName = match[2];
              if (!colorsArray[index]) {
                colorsArray[index] = {};
              }
              colorsArray[index][fieldName] = fields[key][0];
            }
          }
        }

        for (const colorData of colorsArray) {
          const existingStock = await Stock.findOne({
            product: productId,
            color: colorData.color,
          });

          if (existingStock) {
            existingStock.quantity = parseInt(colorData.stock, 10);
            await existingStock.save();
          } else {
            const newStock = new Stock({
              product: productId,
              color: colorData.color,
              quantity: parseInt(colorData.stock, 10),
              userId: userId[0],
            });
            await newStock.save();
          }
        }

        // Save the updated Product
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
