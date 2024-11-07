    import React, { useEffect, useState } from 'react';
    import {
      Button,
      Box,
      InputLabel,
      MenuItem,
      FormControl,
      Select,
      TextField,
      IconButton,
      Container,
      CircularProgress,
    } from '@mui/material';
    import { toast } from 'react-toastify';
    import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

    const ProductForm = ({ fetchProducts, productToEdit }) => {
      console.log(productToEdit);
      
      // console.log(productToEdit);
      
      const [userId, setUserId] = useState('');
      const [formData, setFormData] = useState({
        name: '',
        category: '',
        brand: '',
        sex: 'both', // Default to 'both'
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

            if (categoriesData.success) {
              const filteredCategories = categoriesData.data.filter(
                (category) => category.parent_id !== null
              );
              setCategories(filteredCategories);
            }
            if (brandsData.success) setBrands(brandsData.data);
          } catch (error) {
            toast.error('Failed to fetch data');
          }
        };

        fetchData();  
        if (productToEdit) {
          setFormData({
            name: productToEdit.name || '',
            category: productToEdit.category?._id || '',
            brand: productToEdit.brand?._id || '',
            sex: productToEdit?.sex || 'both',  // Use productToEdit.sex if available, else 'both'
            colors:
              productToEdit.colors.map((color) => ({
                color: color.color || '',
                images: [],
                imagePreviews:
                  color.images.flatMap((img) =>
                    img.urls.map((url) => `/images/uploads/products/${url}`)
                  ) || [],
                stock: color.stock?.quantity || 0,
              })) || [{ color: '', images: [], imagePreviews: [], stock: 0 }],
            tags: productToEdit.tags.join(', ') || '',
            description: productToEdit.details.description || '',
            features: productToEdit.details.features.join(', ') || '',
            specifications:
              productToEdit.details.specifications.join(', ') || '',
            price: productToEdit.details.price || '', 
            weight: productToEdit.details.weight || '',
            dimensions:
              productToEdit.details.dimensions || { length: '', width: '', height: '' },
            shippingOptions:
              productToEdit.details.shippingOptions || [
                { name: '', cost: '', estimatedDeliveryTime: '' },
              ],
            });            
          }
        }, [productToEdit]);
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
      
        // Convert stock to a number if the input is stock
        newColors[index][name] = name === 'stock' ? Number(value) : value;
      
        setFormData({ ...formData, colors: newColors });
      };

      const handleImageChange = (index, e) => {
        const files = Array.from(e.target.files);
        const newColors = [...formData.colors];
        newColors[index].images = files;

        const imagePreviews = files.map((file) => URL.createObjectURL(file));
        newColors[index].imagePreviews = imagePreviews;

        setFormData({ ...formData, colors: newColors });
      };

      const addColor = () => {
        setFormData((prevData) => ({
          ...prevData,
          colors: [
            ...prevData.colors,
            { color: '', stock: '', images: [], imagePreviews: [] }
          ],
        }));            
      };

      const removeColor = (index) => {
        const newColors = formData.colors.filter((_, i) => i !== index);
        setFormData({ ...formData, colors: newColors });
      };

      const handleShippingOptionChange = (index, e) => {
        const { name, value } = e.target;
        const updatedShippingOptions = formData.shippingOptions.map(
          (option, i) => (i === index ? { ...option, [name]: value } : option)
        );
        setFormData({ ...formData, shippingOptions: updatedShippingOptions });
      };

      const addShippingOption = () => {
        setFormData((prevState) => ({
          ...prevState,
          shippingOptions: [
            ...prevState.shippingOptions,
            { name: '', cost: '', estimatedDeliveryTime: '' },
          ],
        }));
      };

      const removeShippingOption = (index) => {
        const updatedShippingOptions = formData.shippingOptions.filter(
          (_, i) => i !== index
        );
        setFormData({ ...formData, shippingOptions: updatedShippingOptions });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (
          formData.shippingOptions.length === 0 ||
          (formData.shippingOptions.length === 1 &&
            !formData.shippingOptions[0].name &&
            !formData.shippingOptions[0].cost &&
            !formData.shippingOptions[0].estimatedDeliveryTime)
        ) {
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
          formDataForUpload.append('sex', formData.sex);
          formDataForUpload.append(
            'dimensions',
            JSON.stringify(formData.dimensions)
          );
          formDataForUpload.append(
            'shippingOptions',
            JSON.stringify(formData.shippingOptions)
          );

          formData.colors.forEach((colorData, index) => {
            formDataForUpload.append(`colors[${index}][color]`, colorData.color);
            formDataForUpload.append(`colors[${index}][stock]`, colorData.stock);
            colorData.images.forEach((file, fileIndex) => {
              formDataForUpload.append(`colors[${index}][images][${fileIndex}]`, file);
            });
          });
        console.log(formData.colors);
        

        try {
          const res = await fetch(
            productToEdit ? `/api/products/${productToEdit._id}` : '/api/products',
            {
              method: productToEdit ? 'PUT' : 'POST',
              body: formDataForUpload,
            }
          );
          console.log(res);
            

          if (res.ok) {
            toast.success('Product saved successfully');
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
            toast.error('Failed to save product');
          }
        } catch (error) {
          toast.error('Error saving product');
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
            <Box sx={{ minWidth: 120, marginTop: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="sex-select-label">Sex</InputLabel>
                <Select
                  labelId="sex-select-label"
                  id="sex-select"
                  name="sex"
                  value={formData.sex}
                  label="Sex"
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="both">Both</MenuItem>
                  <MenuItem value="men">Men</MenuItem>
                  <MenuItem value="women">Women</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {formData.colors.map((colorData, index) => (
                <Box key={index} sx={{ marginTop: 2 }}>
                <TextField
                  label={`Color ${index + 1}`}
                  name="color"
                  value={colorData.color}
                  onChange={(e) => handleColorChange(index, e)}
                  placeholder="Enter color"
                  fullWidth
                  required
                  desabled
                  margin="normal"
                  />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageChange(index, e)}
                />
                <Box sx={{ display: 'flex', marginTop: 2 }}>
                  {colorData.imagePreviews.length > 0 && (                
                    <Box sx={{ marginRight: 2 }}>
                      <img
                        src={colorData.imagePreviews[0]} // Display only the first image
                        alt={`Preview ${index + 1}`}
                        style={{ width: 100, height: 100, objectFit: 'cover' }}
                      />
                    </Box>
                  )}
                </Box>s
                <TextField
                  label="Stock"
                  name="stock"
                  type="number"
                  value={colorData.stock}
                  onChange={(e) => handleColorChange(index, e)}
                  placeholder="Enter stock quantity"
                  fullWidth
                  required
                  margin="normal"
                />
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => removeColor(index)}
                  sx={{ marginTop: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addColor}
              sx={{ marginTop: 2 }}
            >
              Add Color
            </Button>
            <TextField
              label="Tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Enter tags"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="Enter features"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Specifications"
              name="specifications"
              value={formData.specifications}
              onChange={handleChange}
              placeholder="Enter specifications"
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
              type="number"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Enter weight"
              fullWidth
              margin="normal"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Length"
                name="length"
                value={formData.dimensions.length}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions, length: e.target.value },
                  })
                }
                placeholder="Enter length"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Width"
                name="width"
                value={formData.dimensions.width}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions, width: e.target.value },
                  })
                }
                placeholder="Enter width"
                fullWidth
                margin="normal"
              />
              <TextField
                label="Height"
                name="height"
                value={formData.dimensions.height}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dimensions: { ...formData.dimensions, height: e.target.value },
                  })
                }
                placeholder="Enter height"
                fullWidth
                margin="normal"
              />
            </Box>
            {formData.shippingOptions.map((option, index) => (
              <Box key={index} sx={{ marginTop: 2 }}>
                <TextField
                  label={`Shipping Option ${index + 1} Name`}
                  name="name"
                  value={option.name}
                  onChange={(e) => handleShippingOptionChange(index, e)}
                  placeholder="Enter shipping option name"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label={`Shipping Option ${index + 1} Cost`}
                  name="cost"
                  type="number"
                  value={option.cost}
                  onChange={(e) => handleShippingOptionChange(index, e)}
                  placeholder="Enter shipping option cost"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label={`Shipping Option ${index + 1} Estimated Delivery Time`}
                  name="estimatedDeliveryTime"
                  value={option.estimatedDeliveryTime}
                  onChange={(e) => handleShippingOptionChange(index, e)}
                  placeholder="Enter estimated delivery time"
                  fullWidth
                  margin="normal"
                />
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => removeShippingOption(index)}
                  sx={{ marginTop: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addShippingOption}
              sx={{ marginTop: 2 }}
            >
              Add Shipping Option
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
              {loading ? (
                <CircularProgress />
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ width: '100%' }}
                >
                  Save Product
                </Button>
              )}
            </Box>
          </form>
        </Container>
      );
    };

    export default ProductForm;
