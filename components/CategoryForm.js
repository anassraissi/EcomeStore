// components/CategoryForm.js
import { useState, useEffect } from 'react';

const CategoryForm = ({ fetchCategories }) => {
  const [name, setName] = useState('');
  const [parentCategoryId, setParentCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const fetchCategoriesData = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (data.success) {
      setCategories(data.data);
    }
  };

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

    const res = await fetch('/api/categories', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setName('');
      setParentCategoryId('');
      setImage(null);
      fetchCategories(); // Fetch categories after adding a new one
      alert('Category added successfully');
    } else {
      alert('Failed to add category');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Category Name"
        required
      />
      <select value={parentCategoryId} onChange={(e) => setParentCategoryId(e.target.value)}>
        <option value="">Select Parent Category (optional)</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      <input type="file" onChange={handleImageUpload} />
      <button type="submit">Add Category</button>
    </form>
  );
};

export default CategoryForm;
