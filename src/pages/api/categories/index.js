// pages/api/categories/index.js
import formidable from 'formidable';
import path from 'path';
import dbConnect from '../../../../lib/mongodb';
import Category from '../../../../models/Category';

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

      // Extract and log fields
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const parent_id = Array.isArray(fields.parent_id) ? fields.parent_id[0] : fields.parent_id;

      let img_url = '';
      if (files.image && files.image[0].newFilename) {
        img_url = `images/uploads/categories/${files.image[0].newFilename}`;
      }

      console.log('Parsed fields:', { name, parent_id, img_url }); // Debugging log

      try {
        const newCategory = new Category({
          name,
          parent_id: parent_id || null,
          img_url,
        });

        await newCategory.save();
        res.status(201).json(newCategory);
      } catch (error) {
        console.error('Database error:', error);
        res.status(400).json({ success: false, error: `Database error: ${error.message}` });
      }
    });
  } else if (req.method === 'GET') {
    try {
      const categories = await Category.find({}).populate('parent_id');
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch categories' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
