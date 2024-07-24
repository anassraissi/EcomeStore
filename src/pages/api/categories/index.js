// pages/api/categories/index.js
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import dbConnect from '../../../../lib/mongodb';
import Category from '../../../../models/Category';
import Image from '../../../../models/Image';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parsing
  },
};

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const form = formidable({
      uploadDir: path.join(process.cwd(), 'public', 'images', 'uploads', 'categories'),
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(500).json({ success: false, error: 'Form parsing error' });
      }

      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const parent_id = Array.isArray(fields.parent_id) ? fields.parent_id[0] : fields.parent_id;
      const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;

      console.log('Parsed userId:', userId); // Log userId to verify

      try {
        const newCategory = new Category({
          name,
          parent_id: parent_id || null,
          userId:userId, // Save the userId in the category
        });

        await newCategory.save();

        const imageUrls = [];
        if (files.image) {
          const fileArray = Array.isArray(files.image) ? files.image : [files.image];
          for (const file of fileArray) {
            const newFilePath = path.join(form.uploadDir, file.newFilename);
            fs.renameSync(file.filepath, newFilePath);
            imageUrls.push(`${file.newFilename}`);
          }

          const newImage = new Image({
            urls: imageUrls, // Save image filenames as an array
            refId: newCategory._id,
            userId:userId, // Save the userId in the image
            type: 'category',
          });
          const savedImage = await newImage.save();
          newCategory.images.push(savedImage._id);
        }

        await newCategory.save();

        res.status(201).json(newCategory);
      } catch (error) {
        console.error('Database error:', error);
        res.status(400).json({ success: false, error: `Database error: ${error.message}` });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const categories = await Category.find({}).populate('parent_id').populate('images');
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
