import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const ProductForm = () => {
  const [categories, setCategories] = useState([]);
  const [parentCategories,setParentCategories]=useState([]);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        const filteredCategories = data.data.filter(category => category.parent_id !== null);
        setCategories(filteredCategories);
        setParentCategories(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // useEffect to fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // State to hold form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sex: '',
    stock: '',
    imageFiles: [], // Array to store selected image files
  });

  // Handle input change for text fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      imageFiles: files,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

      const getNameParentCat=parentCategories.filter(cat => cat._id == formData.category);
    
    // Create FormData object
    const formDataForUpload = new FormData();
    // Append other form data fields
    formDataForUpload.append('name', formData.name);
    formDataForUpload.append('description', formData.description);
    formDataForUpload.append('category', formData.category);
    formDataForUpload.append('stock', parseInt(formData.stock, 10));
    formDataForUpload.append('sex', formData.sex);
    formDataForUpload.append('price', formData.price);
    formDataForUpload.append('parentCatName',getNameParentCat[0].name
    );

    // Append image files
    formData.imageFiles.forEach((file, index) => {
      formDataForUpload.append(`imageFile-${index}`, file);
    });

    try {
      // Send POST request to API endpoint
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formDataForUpload,
      });

      if (res.ok) {
        // Handle success scenario
        console.log('Product created successfully');
      } else {
        // Handle failure scenario
        console.error('Failed to create product');
      }
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
<Form onSubmit={handleSubmit}>
  <Form.Group>
    <Form.Label>Name</Form.Label>
    <Form.Control
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="Enter product name"
      required
    />
  </Form.Group>

  <Form.Group >
    <Form.Label>Description</Form.Label>
    <Form.Control
      type="text"
      name="description"
      value={formData.description}
      onChange={handleChange}
      placeholder="Enter product description"
    />
  </Form.Group>

  <Form.Group >
    <Form.Label>Price</Form.Label>
    <Form.Control
      type="number"
      name="price"
      value={formData.price}
      onChange={handleChange}
      placeholder="Enter product price"
      required
    />
  </Form.Group>

  <Form.Group >
    <Form.Label>Category</Form.Label>
    <Form.Control
      as="select"
      name="category"
      value={formData.category}
      onChange={handleChange}
      required
    >
      <option value="">Select Category</option>
      {categories.map(category => (
        <option key={category._id} value={category.parent_id._id}>{category.name}</option>
      ))}
    </Form.Control>
  </Form.Group>

  <Form.Group >
    <Form.Label>Sex</Form.Label>
    <Form.Control
      as="select"
      name="sex"
      value={formData.sex}
      onChange={handleChange}
      required
    >
      <option value="">Select Sex</option>
      <option value="Men">Men</option>
      <option value="Women">Women</option>
      <option value="Both">Both</option>
    </Form.Control>
  </Form.Group>

  <Form.Group >
    <Form.Label>Stock</Form.Label>
    <Form.Control
      type="number"
      name="stock"
      value={formData.stock}
      onChange={handleChange}
      placeholder="Enter product stock"
      required
    />
  </Form.Group>

  <Form.Group >
    <Form.Label>Upload Images</Form.Label>
    <Form.Control
      type="file"
      id="custom-file"
      label="Choose file"
      custom
      data-mdb-multiple
      onChange={handleImageChange}
      multiple
    />
  </Form.Group>

  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>

  );
};

export default ProductForm;
