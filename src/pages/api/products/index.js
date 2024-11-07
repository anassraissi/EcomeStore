import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Image from '../../../../models/Image';
import Stock from '../../../../models/Stock';
import DetailProduct from '../../../../models/DetailsProduct';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parsing
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
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
        sex
      } = fields;

      try {
        // Parse JSON fields
        const parsedDimensions = JSON.parse(Array.isArray(dimensions) ? dimensions[0] : dimensions);
        const parsedShippingOptions = JSON.parse(Array.isArray(shippingOptions) ? shippingOptions[0] : shippingOptions);

        // Create and save the Product document
        const newProduct = new Product({
          name: Array.isArray(name) ? name[0] : name,
          category: Array.isArray(category) ? category[0] : category,
          brand: Array.isArray(brand) ? brand[0] : brand,
          userId: Array.isArray(userId) ? userId[0] : userId,
          tags: Array.isArray(tags) ? tags : [tags],
          sex: Array.isArray(sex) ? sex[0] : sex, 
          details: null, // Set initially
        });
        const savedProduct = await newProduct.save();

        // Create and save the DetailProduct document
        const detailProduct = new DetailProduct({
          productId: savedProduct._id,
          description: Array.isArray(description) ? description[0] : description,
          features: Array.isArray(features) ? features.map(item => item.trim()) : [features.trim()],
          specifications: Array.isArray(specifications) 
            ? specifications.map(item => item.trim()) 
            : [specifications.trim()],
          price: Array.isArray(price) ? price[0] : price,
          weight: Array.isArray(weight) ? weight[0] : weight,
          dimensions: parsedDimensions,
          shippingOptions: parsedShippingOptions,
        });
        await detailProduct.save();

        // Update Product document with details
        savedProduct.details = detailProduct._id;
        await savedProduct.save();

        // Set up color and stock handling
        const colors = [];
        const imageIds = [];
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

        // Create folder for each product
        const productFolderName = name.toString().replace(/\s+/g, '-').toLowerCase();
        const productFolderPath = path.join(form.uploadDir, productFolderName);
        if (!fs.existsSync(productFolderPath)) {
          fs.mkdirSync(productFolderPath, { recursive: true });
        }

        // Handle image uploads and associate with product ID
        for (const key in files) {
          if (key.startsWith('colors[')) {
            const match = key.match(/colors\[(\d+)\]\[images\]\[(\d+)\]/);
            if (match) {
              const colorIndex = parseInt(match[1], 10);
              const file = files[key][0];
              const newFilePath = path.join(productFolderPath, file.newFilename);

              // Move file to designated path
              fs.renameSync(file.filepath, newFilePath);

              // Save image details to Image collection
              const newImage = new Image({
                urls: [`${productFolderName}/${file.newFilename}`],
                refId: savedProduct._id,
                type: 'product',
                userId: Array.isArray(userId) ? userId[0] : userId,
              });
              const savedImage = await newImage.save();
              imageIds.push(savedImage._id);

              // Associate images with the correct colors
              if (!colors[colorIndex].images) {
                colors[colorIndex].images = [];
              }
              colors[colorIndex].images.push(savedImage._id);
            }
          }
        }

        // Create stock entries for each color
        let stockData = [];
        if (colors && Array.isArray(colors)) {
          stockData = colors.map((colorData) => ({
            product: savedProduct._id,
            color: colorData.color,
            quantity: parseInt(colorData.stock, 10),
            userId: Array.isArray(userId) ? userId[0] : userId,
          }));
          const savedStocks = await Stock.insertMany(stockData);

          // Update Product document with colors, stock, and images
          savedProduct.colors = savedStocks.map((stock, index) => ({
            color: stock.color,
            stock: stock._id,
            images: colors[index].images || [],
          }));
          await savedProduct.save();
        }

        res.status(201).json(savedProduct);
      } catch (error) {
        console.error('Database error:', error);
        res.status(400).json({ success: false, error: `Database error: ${error.message}` });
      }
    });
  }
  else if (req.method === 'GET') {
    // GET request: Fetch products
    try {
      const products = await Product.find({})
        .populate('category', 'name')
        .populate('brand', 'name')
        .populate('details')
        .populate('colors.stock', 'quantity')
        .populate('colors.images', 'urls')
        .exec();

      res.status(200).json({ success: true, data: products });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ success: false, error: `Database error: ${error.message}` });
    }
  }
  else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
