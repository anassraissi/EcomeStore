import { useState, useEffect } from 'react';
import { Container, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';

const BrandForm = ({ fetchBrands }) => {
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null); // Image preview state

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          const filteredCategories = data.data.filter(category => category.parent_id !== null);
          setCategories(filteredCategories);
        } else {
          toast.error('Failed to fetch categories');
        }
      } catch (error) {
        toast.error('Failed to fetch categories');
      }
    };

    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      toast.error('User ID not found. Please log in again.');
    }

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Set image preview URL
    } else {
      setImagePreview(null); // Reset image preview if no file is selected
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('CategoryId', formData.category);
    formDataObj.append('userId', userId);
    if (formData.image) {
      formDataObj.append('image', formData.image);
    }

    try {
      const res = await fetch('/api/brands', {
        method: 'POST',
        body: formDataObj,
      });

      if (res.ok) {
        toast.success('Brand added successfully');
        setFormData({
          name: '',
          category: '',
          image: null,
        });
        setImagePreview(null); // Reset image preview
        fetchBrands(); // Refresh the list of brands after adding a new one
      } else {
        toast.error('Failed to add brand');
      }
    } catch (error) {
      toast.error('Failed to add brand');
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      category: '',
      image: null,
    });
    setImagePreview(null); // Reset image preview
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Brand Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter brand name"
          fullWidth
          required
          margin="normal"
        />

        <Box sx={{ minWidth: 120, marginTop: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleChange}
              required
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ marginTop: 2 }}>
          <Button variant="contained" component="label">
            Upload Image
            <input type="file" hidden onChange={handleFileChange} accept="image/*" />
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
          <Button type="submit" variant="contained" color="primary" sx={{ mr: 2 }}>
            Add Brand
          </Button>
          <Button variant="outlined" type="button" onClick={handleReset}>
            Reset
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default BrandForm;
