// /pages/api/brands/[id].js
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

        // Ensure brand.images is an array and get the existing image document
        if (!Array.isArray(brand.image)) {
          brand.image = [];
        }
        let existingImage = null;
        console.log(" image ",brand.image[0]);
        if (brand.image.length > 0) {
          // Assuming there's only one image per brand, fetch the first image
          existingImage = await Image.findById(brand.image[0]); 

          if (existingImage) {
            // Delete old image file from disk
            for (const url of existingImage.urls) {
              const oldImagePath = path.join(process.cwd(), 'public', 'images', 'uploads', 'brands', path.parse(url).base);
              if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
              }
            }
          }
        }

        if (files.image) {
          const imageUrls = [];
          const fileArray = Array.isArray(files.image) ? files.image : [files.image];

          for (const file of fileArray) {
            const newFilePath = path.join(form.uploadDir, file.newFilename);
            fs.renameSync(file.filepath, newFilePath);
            imageUrls.push(`${path.parse(newFilePath).base}`);
          }

          if (existingImage) {
            // Update existing image document with new URL(s)
            existingImage.urls = imageUrls;
            await existingImage.save(); // Save the updated image document
          } else {
            // Create a new image document if no existing image is found
            const newImage = new Image({
              urls: imageUrls,
              refId: brand._id,
              userId: userId,
              type: 'brand',
            });
            await newImage.save();
            brand.image = [newImage._id]; // Associate new image with brand
          }

          // Update brand information and save
          brand.name = name;
          brand.categoryId = categoryId;
          brand.userId = userId;
          await brand.save();

          res.status(200).json(brand);
        } else {
          res.status(400).json({ success: false, error: 'No image uploaded' });
        }
      } catch (error) {
        console.error('Database error:', error);
        res.status(400).json({ success: false, error: `Database error: ${error.message}` });
      }
    });
  } 
  
  else if (method === 'DELETE') {
    try {
      // Find the brand by ID to access its images before deletion
      const brand = await Brand.findById(id);
      if (!brand) {
        return res.status(404).json({ success: false, error: 'Brand not found' });
      }
  
      // Delete associated images from both the database and filesystem
      if (Array.isArray(brand.image)) {
        for (const imageId of brand.image) {
          const image = await Image.findById(imageId);
          console.log("image",image);
          
          if (image) {
            for (const url of image.urls) {
              const imagePath = path.join(process.cwd(), 'public', 'images', 'uploads', 'brands', path.parse(url).base);
              if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Delete image file from filesystem
              }
            }
            await Image.findByIdAndDelete(imageId); // Delete image document from database
          }
        }
      }
  
      // Delete the brand document from the database
      await Brand.findByIdAndDelete(id);
  
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting brand or images:', error);
      res.status(400).json({ success: false, error: 'Failed to delete brand and images' });
    }
  }
  
  
  else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
}
