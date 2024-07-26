import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ProductForm = ({ fetchProducts }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    realPrice: '',
    ttcPrice: '',
    sex: '',
    stock: '',
    imageFiles: [],
    tags: '',
    size: '',
    color: '',
    categoryId: '',
    brandId: '',
  });

  const [categories, setCategories] = useState([]);
  const [allBrands, setAllBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);

  // Fetch categories and brands on component mount
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

    const fetchAllBrands = async () => {
      try {
        const res = await fetch('/api/brands');
        const data = await res.json();
        if (data.success) {
          setAllBrands(data.data);
        } else {
          toast.error('Failed to fetch brands');
        }
      } catch (error) {
        toast.error('Failed to fetch brands');
      }
    };

    fetchCategories();
    fetchAllBrands();
  }, []);

  // Filter brands based on selected category
  useEffect(() => {
    setFilteredBrands("")
    if (formData.categoryId) {
      console.log(formData.categoryId);
      const brandsForCategory = allBrands.filter(brand => brand.CategoryId._id===formData.categoryId);
      setFilteredBrands(brandsForCategory);
    } else {
      setFilteredBrands([]);
    }
  }, [formData.categoryId, allBrands]);

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

    const formDataForUpload = new FormData();
    formDataForUpload.append('name', formData.name);
    formDataForUpload.append('description', formData.description);
    formDataForUpload.append('realPrice', formData.realPrice);
    formDataForUpload.append('ttcPrice', formData.ttcPrice);
    formDataForUpload.append('sex', formData.sex);
    formDataForUpload.append('brandId', formData.brandId);
    formDataForUpload.append('tags', formData.tags);
    formDataForUpload.append('size', formData.size);
    formDataForUpload.append('color', formData.color);
    formDataForUpload.append('stock', parseInt(formData.stock, 10));
    formDataForUpload.append('categoryId', formData.categoryId);

    formData.imageFiles.forEach((file, index) => {
      formDataForUpload.append(`imageFile-${index}`, file);
    });

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        body: formDataForUpload,
      });

      if (res.ok) {
        console.log('Product created successfully');
        fetchProducts();
      } else {
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
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Real Price</Form.Label>
        <Form.Control
          type="number"
          name="realPrice"
          value={formData.realPrice}
          onChange={handleChange}
          placeholder="Enter real price"
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>TTC Price</Form.Label>
        <Form.Control
          type="number"
          name="ttcPrice"
          value={formData.ttcPrice}
          onChange={handleChange}
          placeholder="Enter TTC price"
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
        >
          <option>Select Category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Brand</Form.Label>
        <Form.Control
          as="select"
          name="brandId"
          value={formData.brandId}
          onChange={handleChange}
          required
        >
          <option value="">Select Brand</option>
          {filteredBrands.map(brand => (
            <option key={brand.id} value={brand.id}>{brand.name}</option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Sex</Form.Label>
        <Form.Control
          as="select"
          name="sex"
          value={formData.sex}
          onChange={handleChange}
          required
        >
          <option value="">Select Sex</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="both">Both</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
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
      <Form.Group>
        <Form.Label>Tags</Form.Label>
        <Form.Control
          as="textarea"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Enter product tags"
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Size</Form.Label>
        <Form.Control
          type="text"
          name="size"
          value={formData.size}
          onChange={handleChange}
          placeholder="Enter product size"
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Color</Form.Label>
        <Form.Control
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Enter product color"
          required
        />
      </Form.Group>
      <Form.Group>
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
