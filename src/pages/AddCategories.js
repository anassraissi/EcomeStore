import { useState, useEffect } from 'react';
import CategoryForm from "../../components/CategoryForm";
import UpdateCategoryModal from "../../components/UpdateCategoryModal";
import { Table } from 'react-bootstrap';

const AddCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    if (data.success) {
      setCategories(data.data);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const parentCategories = categories.filter(cat => cat.parent_id === null);
  const subCategories = categories.filter(cat => cat.parent_id !== null);

  const handleRowClick = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    fetchCategories(); // Refresh categories after update
  };

  return (
    <div>
      <CategoryForm fetchCategories={fetchCategories} />
      <h2>Parent Categories</h2>
      <CategoriesTable categories={parentCategories} onRowClick={handleRowClick} />
      <h2>Subcategories</h2>
      <CategoriesTable categories={subCategories} onRowClick={handleRowClick} />
      {isModalOpen && selectedCategory && (
        <UpdateCategoryModal 
          category={selectedCategory} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

const CategoriesTable = ({ categories, onRowClick }) => {
  return (
    <Table className="table table-success table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Parent Category</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {categories.map(category => (
          <tr key={category._id} onClick={() => onRowClick(category)}>
            <td>{category.name}</td>
            <td>{category.parent_id ? category.parent_id.name : 'None'}</td>
            <td>
              {category.img_url ? (
                <img src={category.img_url} alt={category.name} width="50" />
              ) : (
                'No Image'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AddCategories;