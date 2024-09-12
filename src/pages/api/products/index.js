  import formidable from 'formidable';
  import path from 'path';
  import fs from 'fs';
  import dbConnect from '../../../../lib/mongodb';
  import Product from '../../../../models/Product';
  import Image from '../../../../models/Image';
  import Stock from '../../../../models/Stock';
  import DetailProduct from '../../../../models/DetailsProduct';
  import Category from '../../../../models/Category';
  import Brand from '../../../../models/Brand';

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
        console.log(fields);
        

        try {
          // Parse dimensions and shippingOptions
          const dimensionsString = Array.isArray(dimensions) ? dimensions[0] : dimensions;
          const shippingOptionsString = Array.isArray(shippingOptions) ? shippingOptions[0] : shippingOptions;
          const parsedDimensions = JSON.parse(dimensionsString || '{}');
          const parsedShippingOptions = JSON.parse(shippingOptionsString || '[]');

          // Create the DetailProduct document
          const detailProduct = new DetailProduct({
            description: Array.isArray(description) ? description[0] : description,
            features: Array.isArray(features) ? features : [features],
            specifications: Array.isArray(specifications) ? specifications : [specifications],
            price: Array.isArray(price) ? price[0] : price,
            weight: Array.isArray(weight) ? weight[0] : weight,
            dimensions: parsedDimensions,
            shippingOptions: parsedShippingOptions,
          });
          await detailProduct.save();

          // Create the Product document first
          const newProduct = new Product({
            name: Array.isArray(name) ? name[0] : name,
            category: Array.isArray(category) ? category[0] : category,
            brand: Array.isArray(brand) ? brand[0] : brand,
            userId: Array.isArray(userId) ? userId[0] : userId,
            details: detailProduct._id,
            tags: Array.isArray(tags) ? tags : [tags],
            sex:Array.isArray(sex) ? sex[0] : sex
          });

          const savedProduct = await newProduct.save();

          // Reconstruct colors from individual fields and associate images with colors
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

          // Handle image uploads and associate with product ID
          // for (const key in files) {
          //   if (key.startsWith('colors[')) {
          //     const match = key.match(/colors\[(\d+)\]\[images\]\[(\d+)\]/);
          //     if (match) {
          //       const colorIndex = parseInt(match[1], 10);
          //       const file = files[key][0];

          //       // Create a folder for the product based on the product name
          //       const productFolderName = name.toString().replace(/\s+/g, '-').toLowerCase(); // Replace spaces with dashes
          //       const productFolderPath = path.join(form.uploadDir, productFolderName);
          //       console.log(productFolderName);
          //       console.log(productFolderPath);
                

          //       // Create the folder if it doesn't exist
          //       if (!fs.existsSync(productFolderPath)) {
          //         fs.mkdirSync(productFolderPath, { recursive: true });
          //       }

          //       const newFilePath = path.join(productFolderPath, file.newFilename);
          //       fs.renameSync(file.filepath, newFilePath);
          //       console.log('Image Path:', path.join(form.uploadDir, productFolderName, file.newFilename));

          //       // Create Image document with refId now populated with product ID
          //       const newImage = new Image({
          //         urls: [`${productFolderName}/${file.newFilename}`], // Use an array for the URLs
          //         refId: savedProduct._id, // refId is now set to the product ID
          //         type: 'product', // Assuming type is 'product' for all uploaded images
          //         userId: userId[0], // User ID from form fields
          //       });
          //       const savedImage = await newImage.save();
          //       imageIds.push(savedImage._id);


          //       // Associate images with the correct colors
          //       if (!colors[colorIndex].images) {
          //         colors[colorIndex].images = [];
          //       }
          //       colors[colorIndex].images.push(savedImage._id);
          //     }
          //   }
          // }
          // Handle image uploads and associate with product ID
for (const key in files) {
  if (key.startsWith('colors[')) {
    const match = key.match(/colors\[(\d+)\]\[images\]\[(\d+)\]/);
    if (match) {
      const colorIndex = parseInt(match[1], 10);
      const file = files[key][0];

      // Create a folder for the product based on the product name
      const productFolderName = name.toString().replace(/\s+/g, '-').toLowerCase(); // Replace spaces with dashes
      const productFolderPath = path.join(form.uploadDir, productFolderName);

      // Create the folder if it doesn't exist
      if (!fs.existsSync(productFolderPath)) {
        fs.mkdirSync(productFolderPath, { recursive: true });
      }

      const newFilePath = path.join(productFolderPath, file.newFilename);
      fs.renameSync(file.filepath, newFilePath);

      // Create Image document with refId now populated with product ID
      const newImage = new Image({
        urls: [`${productFolderName}/${file.newFilename}`], // Use an array for the URLs
        refId: savedProduct._id, // refId is now set to the product ID
        type: 'product', // Assuming type is 'product' for all uploaded images
        userId: userId[0], // User ID from form fields
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


          // Handle multiple stock creation
          let stockData = [];
          if (colors && Array.isArray(colors)) {
            stockData = colors.map((colorData) => ({
              product: savedProduct._id, // Now we have the product ID
              color: colorData.color,
              quantity: parseInt(colorData.stock, 10),
              userId: Array.isArray(userId) ? userId[0] : userId,
            }));

            const savedStocks = await Stock.insertMany(stockData);
            

            // Update the Product with colors, stock information, and images
            savedProduct.colors = savedStocks.map((stock, index) => ({
              color: stock.color,
              stock: stock._id, // Assign the correct Stock IDs
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
