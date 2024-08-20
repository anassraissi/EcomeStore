// pages/api/categories/[id].js
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import dbConnect from '../../../../lib/mongodb';
import Category from '../../../../models/Category';
import Image from '../../../../models/Image';

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
      const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
      console.log(userId);
      


      try {
        // Find the existing category
        const category = await Category.findById(id).populate('images');
        if (!category) {
          return res.status(404).json({ success: false, error: 'Category not found' });
        }

        // Remove existing images from the directory and database
        if (category.images.length > 0) {
          for (const imageId of category.images) {
            const image = await Image.findById(imageId);
            if (image) {
              for (const url of image.urls) {
                const imagePath = path.join(process.cwd(), 'public', 'images', 'uploads', 'categories', path.parse(url).base);
                if (fs.existsSync(imagePath)) {
                  fs.unlinkSync(imagePath);
                }
              }
              await Image.findByIdAndDelete(imageId);
            }
          }
        }

        const imageUrls = [];
        if (files.image) {
          const fileArray = Array.isArray(files.image) ? files.image : [files.image];
          for (const file of fileArray) {
            const newFilePath = path.join(form.uploadDir, file.newFilename);
            fs.renameSync(file.filepath, newFilePath);
            imageUrls.push(`${path.parse(newFilePath).base}`);
          }

          const newImage = new Image({
            urls: imageUrls, // Save image URLs as an array
            refId: category._id,
            userId:userId, // Save the userId in the image
            type: 'category',
          });

          await newImage.save();
          category.images = [newImage._id];
        }

        category.name = name;
        category.parent_id = parentId || null;
        userId:userId, // Save the userId in the image

        await category.save();

        res.status(200).json(category);
      } catch (error) {
        console.error('Database error:', error);
        res.status(400).json({ success: false, error: `Database error: ${error.message}` });
      }
    });
  } else if (method === 'DELETE') {
    try {
      const category = await Category.findByIdAndDelete(id);
      if (category.images.length > 0) {
        for (const imageId of category.images) {
          const image = await Image.findById(imageId);
          if (image) {
            for (const url of image.urls) {
              const imagePath = path.join(process.cwd(), 'public', 'images', 'uploads', 'categories', path.parse(url).base);
              if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
              }
            }
            await Image.findByIdAndDelete(imageId);
          }
        }
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
