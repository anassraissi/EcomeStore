import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UpdateCategoryModal = ({ category, onClose }) => {
  const [name, setName] = useState(category.name);
  const [parentCategoryId, setParentCategoryId] = useState(category.parent_id ? category.parent_id._id : '');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategoriesData = async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    };
    fetchCategoriesData();
  }, []);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('parent_id', parentCategoryId);
    if (image) {
      formData.append('image', image);
    }

    const res = await fetch(`/api/categories/${category._id}`, {
      method: 'PUT',
      body: formData,
    });

    if (res.ok) {
      onClose();
      alert('Category updated successfully');
    } else {
      alert('Failed to update category');
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name"
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Parent Category</Form.Label>
            <Form.Control 
              as="select" 
              value={parentCategoryId} 
              onChange={(e) => setParentCategoryId(e.target.value)}
            >
              <option value="">Select Parent Category (optional)</option>
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
          <Button type="submit">Update Category</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateCategoryModal;
