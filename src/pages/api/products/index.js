import formidable from 'formidable';
import path from 'path';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

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
            console.log('Fields:', fields);
            console.log('Files:', files);      // Extract fields
      const {
        name,
        description,
        price,
        category,
        sex,
        stock,
      } = fields;

      // Handle multiple image uploads
      const imageUrls = files.images ? files.images.map(file => `/uploads/products/${file.newFilename}`) : [];

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
