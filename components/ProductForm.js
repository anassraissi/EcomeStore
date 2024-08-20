import React, { useEffect, useState } from 'react';
import { Button, Box, InputLabel, MenuItem, FormControl, Select, TextField, Grid, IconButton, Container, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ProductForm = ({ fetchProducts }) => {
  const [userId, setUserId] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    colors: [{ color: '', images: [], imagePreviews: [], stock: 0 }],
    tags: '',
    description: '',
    features: '',
    specifications: '',
    price: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    shippingOptions: [{ name: '', cost: '', estimatedDeliveryTime: '' }],
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    const fetchData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/brands'),
        ]);
        const [categoriesData, brandsData] = await Promise.all([
          categoriesRes.json(),
          brandsRes.json(),
        ]);

        if (categoriesData.success)  {
          const filteredCategories = categoriesData.data.filter(category => category.parent_id !== null);
          setCategories(filteredCategories);
        }
        if (brandsData.success) setBrands(brandsData.data);
      } catch (error) {
        toast.error('Failed to fetch data');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleColorChange = (index, e) => {
    const { name, value } = e.target;
    const newColors = [...formData.colors];
    newColors[index][name] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const handleImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const newColors = [...formData.colors];
    newColors[index].images = files;

    // Generate image previews
    const imagePreviews = files.map((file) => URL.createObjectURL(file));
    newColors[index].imagePreviews = imagePreviews;

    setFormData({ ...formData, colors: newColors });
  };

  const addColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { color: '', images: [], imagePreviews: [], stock: 0 }]
    });
  };

  const removeColor = (index) => {
    const newColors = formData.colors.filter((_, i) => i !== index);
    setFormData({ ...formData, colors: newColors });
  };

  const handleShippingOptionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedShippingOptions = formData.shippingOptions.map((option, i) =>
      i === index ? { ...option, [name]: value } : option
    );
    setFormData({ ...formData, shippingOptions: updatedShippingOptions });
  };

  const addShippingOption = () => {
    setFormData((prevState) => ({
      ...prevState,
      shippingOptions: [...prevState.shippingOptions, { name: '', cost: '', estimatedDeliveryTime: '' }],
    }));
  };

  const removeShippingOption = (index) => {
    const updatedShippingOptions = formData.shippingOptions.filter((_, i) => i !== index);
    setFormData({ ...formData, shippingOptions: updatedShippingOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (formData.shippingOptions.length === 0 || (formData.shippingOptions.length === 1 && !formData.shippingOptions[0].name && !formData.shippingOptions[0].cost && !formData.shippingOptions[0].estimatedDeliveryTime)) {
      formData.shippingOptions = [
        {
          name: 'Standard Shipping',
          cost: 5.99,
          estimatedDeliveryTime: '5-7 business days',
        },
      ];
    }

    const formDataForUpload = new FormData();
    formDataForUpload.append('name', formData.name);
    formDataForUpload.append('category', formData.category);
    formDataForUpload.append('brand', formData.brand);
    formDataForUpload.append('userId', userId);
    formDataForUpload.append('tags', formData.tags); 
    formDataForUpload.append('description', formData.description);
    formDataForUpload.append('features', formData.features); 
    formDataForUpload.append('specifications', formData.specifications);
    formDataForUpload.append('price', formData.price);
    formDataForUpload.append('weight', formData.weight);
    formDataForUpload.append('dimensions', JSON.stringify(formData.dimensions));
    formDataForUpload.append('shippingOptions', JSON.stringify(formData.shippingOptions));

    formData.colors.forEach((colorData, index) => {
      formDataForUpload.append(`colors[${index}][color]`, colorData.color);
      formDataForUpload.append(`colors[${index}][stock]`, colorData.stock);
      colorData.images.forEach((file, fileIndex) => {
        formDataForUpload.append(`colors[${index}][images][${fileIndex}]`, file);
      });
    });

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formDataForUpload,
      });

      if (res.ok) {
        toast.success('Product created successfully');
        fetchProducts();
        setFormData({
          name: '',
          category: '',
          brand: '',
          colors: [{ color: '', images: [], imagePreviews: [], stock: 0 }],
          tags: '',
          description: '',
          features: '',
          specifications: '',
          price: '',
          weight: '',
          dimensions: { length: '', width: '', height: '' },
          shippingOptions: [{ name: '', cost: '', estimatedDeliveryTime: '' }],
        });
      } else {
        toast.error('Failed to create product');
      }
    } catch (error) {
      toast.error('Error creating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
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
        <Box sx={{ minWidth: 120, marginTop: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="brand-select-label">Brand</InputLabel>
            <Select
              labelId="brand-select-label"
              id="brand-select"
              name="brand"
              value={formData.brand}
              label="Brand"
              onChange={handleChange}
              required
            >
              <MenuItem value="">Select Brand</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand._id} value={brand._id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          fullWidth
          required
          margin="normal"
        />

        {formData.colors.map((colorData, index) => (
          <Grid container spacing={2} key={index} alignItems="center" sx={{ marginTop: 2 }}>
            <Grid item xs={3}>
              <TextField
                label="Color"
                name="color"
                value={colorData.color}
                onChange={(e) => handleColorChange(index, e)}
                placeholder="Enter color"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={colorData.stock}
                onChange={(e) => handleColorChange(index, e)}
                placeholder="Enter stock"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => removeColor(index)}
              >
                Remove Color
              </Button>
            </Grid>
            <Grid item xs={3}>
              <input
                type="file"
                multiple
                onChange={(e) => handleImageChange(index, e)}
                style={{ display: 'none' }}
                id={`color-images-${index}`}
              />
              <label htmlFor={`color-images-${index}`}>
                <Button variant="outlined" component="span" startIcon={<AddIcon />}>
                  Add Images
                </Button>
              </label>
              <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
                {colorData.imagePreviews.map((preview, i) => (
                  <img
                    key={i}
                    src={preview}
                    alt={`Color ${index} Preview ${i}`}
                    style={{ width: 100, height: 100, objectFit: 'cover' }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={addColor}
          startIcon={<AddIcon />}
          sx={{ marginTop: 2 }}
        >
          Add Color
        </Button>

        <TextField
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Enter tags (comma separated)"
          fullWidth
          margin="normal"
        />

        <TextField
          label="Features"
          name="features"
          value={formData.features}
          onChange={handleChange}
          placeholder="Enter product features"
          fullWidth
          margin="normal"
        />

        <TextField
          label="Specifications"
          name="specifications"
          value={formData.specifications}
          onChange={handleChange}
          placeholder="Enter product specifications"
          fullWidth
          margin="normal"
        />

        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
          fullWidth
          required
          margin="normal"
        />

        <TextField
          label="Weight"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Enter weight"
          fullWidth
          margin="normal"
        />

        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid item xs={4}>
            <TextField
              label="Length"
              name="length"
              value={formData.dimensions.length}
              onChange={(e) => handleChange({ target: { name: 'dimensions', value: { ...formData.dimensions, length: e.target.value } } })}
              placeholder="Length"
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Width"
              name="width"
              value={formData.dimensions.width}
              onChange={(e) => handleChange({ target: { name: 'dimensions', value: { ...formData.dimensions, width: e.target.value } } })}
              placeholder="Width"
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="Height"
              name="height"
              value={formData.dimensions.height}
              onChange={(e) => handleChange({ target: { name: 'dimensions', value: { ...formData.dimensions, height: e.target.value } } })}
              placeholder="Height"
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>

        {formData.shippingOptions.map((option, index) => (
          <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
            <Grid item xs={4}>
              <TextField
                label="Shipping Option Name"
                name="name"
                value={option.name}
                onChange={(e) => handleShippingOptionChange(index, e)}
                placeholder="Shipping option name"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Cost"
                name="cost"
                type="number"
                value={option.cost}
                onChange={(e) => handleShippingOptionChange(index, e)}
                placeholder="Cost"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Estimated Delivery Time"
                name="estimatedDeliveryTime"
                value={option.estimatedDeliveryTime}
                onChange={(e) => handleShippingOptionChange(index, e)}
                placeholder="Estimated delivery time"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => removeShippingOption(index)}
              >
                Remove Shipping Option
              </Button>
            </Grid>
          </Grid>
        ))}

        <Button
          variant="contained"
          color="primary"
          onClick={addShippingOption}
          startIcon={<AddIcon />}
          sx={{ marginTop: 2 }}
        >
          Add Shipping Option
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ProductForm;
