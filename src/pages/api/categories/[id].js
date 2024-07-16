// pages/api/categories/[id].js
import formidable from 'formidable';
import path from 'path';
import dbConnect from '../../../../lib/mongodb';
import Category from '../../../../models/Category';
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  await dbConnect();

  const { method, query: { id } } = req;

  if (method === 'PUT') {
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
      const parentId = Array.isArray(fields.parent_id) ? fields.parent_id[0] : fields.parent_id;

      let imgUrl = '';
      if (files.image && files.image[0].newFilename) {
        imgUrl = `images/uploads/categories/${files.image[0].newFilename}`;
      }

      try {
        const updatedCategory = await Category.findByIdAndUpdate(id, {
          name,
          parent_id: parentId || null,
          ...(imgUrl && { img_url: imgUrl }), // Only update img_url if there's a new image
        }, { new: true });
        res.status(200).json(updatedCategory);
      } catch (error) {
        console.error('Database error:', error);
        res.status(400).json({ success: false, error: 'Database error' });
      }
    });
  }
  else if (method === 'DELETE') {
  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false });
  }
  }
  else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
