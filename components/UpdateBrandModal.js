// components/UpdateBrandModal.js
import { useState, useEffect } from 'react';
import Modal from 'react-modal';

const UpdateBrandModal = ({ brand, onClose, fetchBrands }) => {
  const [name, setName] = useState(brand.name);
  const [categoryId, setCategoryId] = useState(brand.CategoryId._id);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('categoryId', categoryId);
    if (image) {
      formData.append('image', image);
    }

    const response = await fetch(`/api/brands/${brand._id}`, {
      method: 'PUT',
      body: formData,
    });

    if (response.ok) {
      fetchBrands();
      onClose();
    } else {
      console.error('Error updating brand:', response.statusText);
    }
  };

  return (
    <Modal isOpen={!!brand} onRequestClose={onClose}>
      <h2>Update Brand</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Brand Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="categoryId">Category:</label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Select a Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit">Update Brand</button>
      </form>
      <button onClick={onClose}>Close</button>
    </Modal>
  );
};

export default UpdateBrandModal;
