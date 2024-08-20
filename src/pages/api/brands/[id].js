// pages/api/brands/[id].js
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import dbConnect from '../../../../lib/mongodb';
import Brand from '../../../../models/Brand';
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
      uploadDir: path.join(process.cwd(), 'public', 'images', 'uploads', 'brands'),
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(500).json({ success: false, error: 'Form parsing error' });
      }

      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const categoryId = Array.isArray(fields.categoryId) ? fields.categoryId[0] : fields.categoryId;
      const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;

      try {
        // Find the existing brand
        const brand = await Brand.findById(id).populate('image');
        if (!brand) {
          return res.status(404).json({ success: false, error: 'Brand not found' });
        }

        // Ensure brand.images is initialized as an array
        if (!Array.isArray(brand.images)) {
          brand.images = [];
        }

        // Remove existing images from the directory and database if new images are uploaded
        if (files.image) {
          // Remove existing images if any
          if (brand.images.length > 0) {
            for (const imageId of brand.images) {
              const image = await Image.findById(imageId);
              if (image) {
                for (const url of image.urls) {
                  const imagePath = path.join(process.cwd(), 'public', 'images', 'uploads', 'brands', path.parse(url).base);
                  if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                  }
                }
                await Image.findByIdAndDelete(imageId);
              }
            }
          }

          // Process and save new image(s)
          const imageUrls = [];
          const fileArray = Array.isArray(files.image) ? files.image : [files.image];
          for (const file of fileArray) {
            const newFilePath = path.join(form.uploadDir, file.newFilename);
            fs.renameSync(file.filepath, newFilePath);
            imageUrls.push(`${path.parse(newFilePath).base}`);
          }

          const newImage = new Image({
            urls: imageUrls,
            refId: brand._id,
            userId: userId,
            type: 'brand',
          });

          await newImage.save();
          brand.images = [newImage._id];
        }

        // Update brand details
        brand.name = name;
        brand.categoryId = categoryId;
        brand.userId = userId;

        await brand.save();

        res.status(200).json(brand);
      } catch (error) {
        console.error('Database error:', error);
        res.status(400).json({ success: false, error: `Database error: ${error.message}` });
      }
    });
  } else if (method === 'DELETE') {
    try {
      const brand = await Brand.findByIdAndDelete(id);
      if (brand && Array.isArray(brand.images)) {
        for (const imageId of brand.images) {
          const image = await Image.findById(imageId);
          if (image) {
            for (const url of image.urls) {
              const imagePath = path.join(process.cwd(), 'public', 'images', 'uploads', 'brands', path.parse(url).base);
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
      res.status(400).json({ success: false, error: 'Failed to delete brand' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
