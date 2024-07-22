import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const BrandForm = ({ fetchBrands }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: null,
  });
  const [categories, setCategories] = useState([]);

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
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('CategoryId', formData.category);
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
        fetchBrands(); // Refresh the list of brands after adding a new one
      } else {
        toast.error('Failed to add brand');
      }
    } catch (error) {
      toast.error('Failed to add brand');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="brandName">
        <Form.Label>Brand Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="categorySelect">
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="imageUpload">
        <Form.Label>Image</Form.Label>
        <Form.Control
          type="file"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Brand
      </Button>
    </Form>
  );
};

export default BrandForm;
