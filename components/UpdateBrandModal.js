import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UpdateBrandModal = ({ brand, onClose, fetchBrands }) => {
  const [name, setName] = useState(brand.name);
  const [categoryId, setCategoryId] = useState(brand.categoryId ? brand.categoryId._id : '');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    setUserId(localStorage.getItem('userId'));
    const fetchCategories = async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('categoryId', categoryId);
    formData.append('userId', userId);
    if (image) {
      formData.append('image', image);
    }

    const res = await fetch(`/api/brands/${brand._id}`, {
      method: 'PUT',
      body: formData,
    });

    if (res.ok) {
      onClose();
      alert('Brand updated successfully');
      fetchBrands();
    } else {
      alert('Failed to update brand');
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Brand</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Brand Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Brand Name"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control 
              as="select" 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" onChange={handleImageUpload} />
          </Form.Group>
          <Button type="submit">Update Brand</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateBrandModal;
