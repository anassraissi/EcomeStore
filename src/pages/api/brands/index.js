// pages/api/brands/index.js
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import dbConnect from '../../../../lib/mongodb';
import Brand from '../../../../models/Brand';
import Image from '../../../../models/Image';
import Category from '../../../../models/Category';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'uploads', 'brands');
    
    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      uploadDir,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(500).json({ success: false, error: 'Form parsing error' });
      }

      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const categoryId = Array.isArray(fields.CategoryId) ? fields.CategoryId[0] : fields.CategoryId;
      const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;

      try {
        // Ensure category exists
        const category = await Category.findById(categoryId);
        if (!category) {
          return res.status(400).json({ success: false, error: 'Category not found' });
        }

        const imageUrls = [];
        if (files.image) {
          const fileArray = Array.isArray(files.image) ? files.image : [files.image];
          for (const file of fileArray) {
            const newFilePath = path.join(uploadDir, file.newFilename);
            fs.renameSync(file.filepath, newFilePath);
            imageUrls.push(`${file.newFilename}`);
          }
          
          const newImage = new Image({
            urls: imageUrls,
            refId: category._id,
            userId,
            type: 'brand',
          });
          const savedImage = await newImage.save();

          const newBrand = new Brand({
            name,
            CategoryId: categoryId,
            image: savedImage._id,
            userId,
          });

          await newBrand.save();

          res.status(201).json(newBrand);
        } else {
          res.status(400).json({ success: false, error: 'Image file is required' });
        }
      } catch (error) {
        console.error('Database error:', error);
        res.status(400).json({ success: false, error: `Database error: ${error.message}` });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const brands = await Brand.find({}).populate('CategoryId').populate('image');
      res.status(200).json({ success: true, data: brands });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch brands' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
