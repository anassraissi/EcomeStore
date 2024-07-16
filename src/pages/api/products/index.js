import formidable from 'formidable';
import path from 'path';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parsing
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const form = formidable({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(500).json({ success: false, error: 'Form parsing error' });
      }

      // Extract fields from form data
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const sex = Array.isArray(fields.sex) ? fields.sex[0] : fields.sex;
      const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
      const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;
      const stock = Array.isArray(fields.stock) ? fields.stock[0] : fields.stock;
      const parentCatName = Array.isArray(fields.parentCatName) ? fields.parentCatName[0] : fields.parentCatName;

      // Adjust the uploadDir path dynamically based on the product name
      const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads', 'products', parentCatName, name);

      // Create a directory for the product if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log(`Created directory: ${uploadDir}`);
      }

      const imageUrls = [];
      for (const key in files) {
        if (files.hasOwnProperty(key)) {
          const fileArray = Array.isArray(files[key]) ? files[key] : [files[key]];

          fileArray.forEach(file => {
            const newFilePath = path.join(uploadDir, file.newFilename);
            fs.renameSync(file.filepath, newFilePath); // Move file to the product directory
            imageUrls.push(`/images/uploads/products/${parentCatName}/${name}/${file.newFilename}`);
          });
        }
      }


      try {
        const newProduct = new Product({
          name,
          description,
          price,
          category,
          sex,
          imageUrls,
          stock: parseInt(stock, 10),
        });

        await newProduct.save();
        res.status(201).json(newProduct);
      } catch (error) {
        console.error('Database error:', error);
        res.status(400).json({ success: false, error: `Database error: ${error.message}` });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const products = await Product.find({}).populate('category');
      res.status(200).json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch products' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
