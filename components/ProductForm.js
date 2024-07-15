import { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const ProductForm = () => {

    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.success) {
          const filteredCategories = data.data.filter(category => category.parent_id !== null);
          setCategories(filteredCategories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
  
    useEffect(() => {
      fetchCategories();
    }, []);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    sex: '',
    imageUrl: '', // Remove imageUrl from initial state
    stock: '',
    imageFile: null, // Add imageFile state to store the selected file
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      imageFile: e.target.files[0], // Store the selected file in imageFile state
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataForUpload = new FormData();
    formDataForUpload.append('name', formData.name);
    formDataForUpload.append('description', formData.description);
    formDataForUpload.append('price', formData.price);
    formDataForUpload.append('category', formData.category);
    formDataForUpload.append('sex', formData.sex);
    formDataForUpload.append('stock', formData.stock);
    formDataForUpload.append('imageFile', formData.imageFile); // Append the image file to FormData

    try {
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
      <Form.Group controlId="formProductName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter product name" required />
      </Form.Group>

      <Form.Group controlId="formProductDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Enter product description" />
      </Form.Group>

      <Form.Group controlId="formProductPrice">
        <Form.Label>Price</Form.Label>
        <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Enter product price" required />
      </Form.Group>

      <Form.Group controlId="formProductCategory">
          <Form.Label>Category</Form.Label>
          <Form.Control as="select" name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </Form.Control>
        </Form.Group>

      <Form.Group controlId="formProductSex">
        <Form.Label>Sex</Form.Label>
        <Form.Control as="select" name="sex" value={formData.sex} onChange={handleChange} required>
          <option value="">Select Sex</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Both">Both</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formProductStock">
        <Form.Label>Stock</Form.Label>
        <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Enter product stock" required />
      </Form.Group>

      <Form.Group controlId="formProductImage">
        <Form.Label>Upload Image</Form.Label>
        <Form.Control type="file" onChange={handleImageChange} accept="image/*" required />
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default ProductForm;
