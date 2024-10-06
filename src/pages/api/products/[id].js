import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import Stock from '../../../../models/Stock';
import DetailProduct from '../../../../models/DetailsProduct';
import Image from '../../../../models/Image';
import { log } from 'react-modal/lib/helpers/ariaAppHider';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parsing
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'PUT') {
    const form = formidable({
      multiples: true, // Allow multiple file uploads
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

        console.log('Parsed Fields:', fields);
        console.log('Uploaded Files:', files);

        const productId = req.query.id;
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }

        // Update product fields
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
        product.sex = sex[0] || 'both';

        let detailProduct = await DetailProduct.findOne({ productId: productId });
        if (!detailProduct) {
          detailProduct = new DetailProduct({
            productId: productId,
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

        for (const colorIndex in colorsArray) {
          const colorData = colorsArray[colorIndex];

          const existingColor = product.colors.find(c => c.color === colorData.color);
          let colorId;

          if (!existingColor) {
            const newColor = {
              color: colorData.color,
              stock: null,
              images: [],
            };
            product.colors.push(newColor);
            await product.save();
            const updatedProduct = await Product.findById(productId);
            const createdColor = updatedProduct.colors.find(c => c.color === colorData.color);
            colorId = createdColor._id;
          } else {
            colorId = existingColor._id;
          }

          const existingStock = await Stock.findOne({
            product: productId,
            color: colorData.color,
          });
          
          if (existingStock) {
            // Update the existing stock's quantity
            existingStock.quantity = parseInt(colorData.stock, 10);
            const updatedStock = await existingStock.save(); // Save the updated stock
            console.log("Updated existing stock:", updatedStock);
          
            // Now update the product with the existing stock reference
            const updateResult = await Product.updateOne(
              { _id: productId, 'colors.color': colorData.color },
              { $set: { 'colors.$.stock': existingStock._id } } // Use existing stock's ID
            );
          
            console.log("Updating product with ID:", productId, "and color:", colorData.color);
            console.log("Product update result:", updateResult);
          
            // Check if the update actually modified a document
            if (updateResult.nModified === 0) {
              console.error("Product update failed. Ensure that color matches and the stock reference is updated.");
            } else {
              console.log("Product stock reference updated successfully.");
            }
          } else {
            // Handle case where there is no existing stock
            const newStock = new Stock({
              product: productId,
              color: colorData.color,
              quantity: parseInt(colorData.stock, 10),
              userId: userId[0],
            });
          
            const savedStock = await newStock.save();
            console.log("New stock saved:", savedStock);
          
            const updateResult = await Product.updateOne(
              { _id: productId, 'colors.color': colorData.color },
              { $set: { 'colors.$.stock': savedStock._id } } // Save new stock reference
            );
          
            console.log("Updating product with ID:", productId, "and color:", colorData.color);
            console.log("Product update result:", updateResult);
          }
          
          

          // Handling single image per color
          const imageFilesKey = `colors[${colorIndex}][images][0]`;
          const imageFile = files[imageFilesKey]; // Only one image per color          
          let savedImageId = null;

          // Get existing image if it exists
          const existingImages = await Product.findOne(
            { _id: productId, 'colors.color': colorData.color },
            { 'colors.$': 1 }
          );

          if (existingImages && existingImages.colors.length > 0) {
            const existingColor = existingImages.colors[0];
            if (existingColor.images && existingColor.images.length > 0) {
              savedImageId = existingColor.images[0]; // Assume one image exists
            }
          }

          // If a new image is uploaded, replace the existing image
          if (imageFile) {
            const { newFilename } = imageFile[0];
            console.log(newFilename);
            

            const image = new Image({
              urls: [newFilename],
              refId: productId,
              userId: userId[0],
              type: 'product',
              colorId,
            });
            await image.save();

            savedImageId = image._id; // Set new image ID
          }

          // Update the product with the new or existing image for the color
          await Product.updateOne(
            { _id: productId, 'colors.color': colorData.color },
            { $set: { 'colors.$.images': [savedImageId] } } // Ensure it's an array with one image
          );
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
