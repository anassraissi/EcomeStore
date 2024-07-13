// pages/api/categories/upload.js
import nextConnect from 'next-connect';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import dbConnect from '../../../../lib/mongodb';
import Category from '../../../../models/Category';

dbConnect();

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(501).json({ error: `Sorry something happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use((req, res, next) => {
  const form = formidable({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    req.body = fields;
    req.file = files.file;
    next();
  });
});

apiRoute.post(async (req, res) => {
  const { name, parent_id } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const category = new Category({
      name,
      parent_id,
      img_url: `/uploads/${file.newFilename}`,
    });
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};

export default apiRoute;
