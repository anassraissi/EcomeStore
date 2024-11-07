import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Stock from '../../../../models/Stock';
import DetailProduct from '../../../../models/DetailsProduct';
import Image from '../../../../models/Image';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parsing
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PUT') {
    const productId = req.query.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Define the exact path for the product folder
    const productSlug = product.name.replace(/\s+/g, '-').toLowerCase();
    const productFolderPath = path.join(process.cwd(), 'public', 'images', 'uploads', 'products', productSlug);
    console.log("productFolderPath:", productFolderPath);

    // Only create the folder if the exact path does not exist
    if (!fs.existsSync(productFolderPath)) {
      console.log("Folder does not exist, creating new folder:", productFolderPath);
      fs.mkdirSync(productFolderPath, { recursive: true });
    } else {
      console.log("Using existing folder for product images:", productFolderPath);
    }

    const form = formidable({
      multiples: true,
      uploadDir: productFolderPath, // Use the exact folder path for each product
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(500).json({ success: false, error: 'Form parsing error' });
      }
      console.log("Uploaded files:", files);
      console.log("Expected product folder path:", productFolderPath);

      try {
        // Update product details based on fields
        product.name = fields.name[0];
        product.category = fields.category[0];
        product.brand = fields.brand[0];
        product.userId = fields.userId[0];
        product.tags = fields.tags[0];
        product.description = fields.description[0];
        product.price = parseFloat(fields.price[0]);
        product.weight = parseFloat(fields.weight[0]);
        product.dimensions = JSON.parse(fields.dimensions[0]);
        product.shippingOptions = JSON.parse(fields.shippingOptions[0]);
        product.sex = fields.sex[0] || 'both';

        // Update DetailProduct
        let detailProduct = await DetailProduct.findOne({ productId });
        if (!detailProduct) {
          detailProduct = new DetailProduct({
            productId,
            description: fields.description[0],
            features: fields.features[0].split(','),
            specifications: fields.specifications[0].split(','),
            price: parseFloat(fields.price[0]),
            weight: parseFloat(fields.weight[0]),
            dimensions: JSON.parse(fields.dimensions[0]),
            shippingOptions: JSON.parse(fields.shippingOptions[0]),
          });
        } else {
          detailProduct.description = fields.description[0];
          detailProduct.features = fields.features[0].split(',');
          detailProduct.specifications = fields.specifications[0].split(',');
          detailProduct.price = parseFloat(fields.price[0]);
          detailProduct.weight = parseFloat(fields.weight[0]);
          detailProduct.dimensions = JSON.parse(fields.dimensions[0]);
          detailProduct.shippingOptions = JSON.parse(fields.shippingOptions[0]);
        }
        await detailProduct.save();

        // Handle color and stock updates
        const colorsArray = [];
        for (const key in fields) {
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

        for (const colorData of colorsArray) {
          const existingColor = product.colors.find(c => c.color === colorData.color);
          let colorId = existingColor ? existingColor._id : null;

          if (!existingColor) {
            product.colors.push({ color: colorData.color, stock: null, images: [] });
            await product.save();
            const updatedProduct = await Product.findById(productId);
            colorId = updatedProduct.colors.find(c => c.color === colorData.color)._id;
          }

          // Update or create stock
          let stock = await Stock.findOne({ product: productId, color: colorData.color });
          if (!stock) {
            stock = new Stock({ product: productId, color: colorData.color, quantity: parseInt(colorData.stock, 10), userId: fields.userId[0] });
          } else {
            stock.quantity = parseInt(colorData.stock, 10);
          }
          await stock.save();

          // Update product with stock reference
          await Product.updateOne({ _id: productId, 'colors.color': colorData.color }, { $set: { 'colors.$.stock': stock._id } });

          // Handle image upload for color
          const imageFile = files[`colors[${colorsArray.indexOf(colorData)}][images][0]`];
          console.log("imageFile : "+imageFile);
          
          if (imageFile) {
            const image = new Image({
              urls: [`${productSlug}/${imageFile[0].newFilename}`], // Add productSlug as a folder in the URL
              refId: productId,
              userId: fields.userId[0],
              type: 'product',
              colorId,
            });
            await image.save();
            await Product.updateOne({ _id: productId, 'colors.color': colorData.color }, { $set: { 'colors.$.images': [image._id] } });
          }
        }

        await product.save();
        res.status(200).json({ success: true, data: product });
      } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ success: false, error: `Database error: ${error.message}` });
      }
    });
  } else if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      // Delete associated stocks and images
      await Stock.deleteMany({ product: id });
      for (const color of product.colors) {
        for (const imageId of color.images) {
          const image = await Image.findById(imageId);
          if (image) {
            for (const url of image.urls) {
              const imagePath = path.join(process.cwd(), 'public', 'uploads', 'products', product.name.replace(/\s+/g, '-').toLowerCase(), url);
              if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
            }
            await Image.findByIdAndDelete(imageId);
          }
        }
      }

      await DetailProduct.findOneAndDelete({ productId: id });
      await Product.findByIdAndDelete(id);

      res.status(200).json({ success: true, message: 'Product and associated data deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ success: false, error: `Failed to delete product: ${error.message}` });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
