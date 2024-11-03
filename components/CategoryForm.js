import React, { useState, useEffect } from 'react';
import { Button, Box, InputLabel, MenuItem, FormControl, Select, TextField, Container } from '@mui/material';
import { toast } from 'react-toastify';

const CategoryForm = ({ fetchCategories }) => {
  const [name, setName] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Image preview state
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    fetchCategoriesData();
  }, [categories]);

  const fetchCategoriesData = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      toast.error('Error fetching categories');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Set image preview
    } else {
      setImagePreview(null); // Reset image preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('parent_id', parentCategoryId);
    formData.append('userId', userId);
    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setName('');
        setParentCategoryId('');
        setImage(null);
        setImagePreview(null); // Reset image preview after submit
        fetchCategories();
        toast.success('Category added successfully');
      } else {
        toast.error('Failed to add category');
      }
    } catch (error) {
      toast.error('Error adding category');
    }
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          fullWidth
          required
          margin="normal"
        />
        <Box sx={{ minWidth: 120, marginTop: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="parent-category-select-label">Parent Category</InputLabel>
            <Select
              labelId="parent-category-select-label"
              id="parent-category-select"
              value={parentCategoryId}
              label="Parent Category (optional)"
              onChange={(e) => setParentCategoryId(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" component="label">
            Upload Image
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
        </Box>
        {imagePreview && (
          <Box sx={{ marginTop: 2, textAlign: 'center' }}>
            <img
              src={imagePreview}
              alt="Preview"
              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
            />
          </Box>
        )}
        <Box sx={{ marginTop: 3 }}>
          <Button type="submit" variant="contained" color="primary">
            Add Category
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CategoryForm;
