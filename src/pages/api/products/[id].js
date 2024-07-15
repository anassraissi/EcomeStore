// pages/api/products/[id].js
import nextConnect from 'next-connect';
import dbConnect from '../../../../lib/mongodb';
import Product from '../../../../models/Product';

const handler = nextConnect()
  .use((req, res, next) => {
    dbConnect();
    next();
  })
  .get(async (req, res) => {
    try {
      const product = await Product.findById(req.query.id).populate('category');
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.status(200).json({ success: true, data: product });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch product' });
    }
  })
  .put(async (req, res) => {
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
        description,
        price,
        category,
        sex,
        stock,
      } = fields;

      const imageUrls = files.images ? files.images.map(file => `/uploads/${file.newFilename}`) : [];

      try {
        const updatedProduct = await Product.findByIdAndUpdate(
          req.query.id,
          {
            name,
            description,
            price,
            category,
            sex,
            imageUrls,
            stock: parseInt(stock, 10),
          },
          { new: true }
        );

        if (!updatedProduct) {
          return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.status(200).json({ success: true, data: updatedProduct });
      } catch (error) {
        console.error('Database error:', error);
        res.status(400).json({ success: false, error: 'Database error' });
      }
    });
  })
  .delete(async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.query.id);
      if (!deletedProduct) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }
      res.status(200).json({ success: true, data: deletedProduct });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
  });

export default handler;
