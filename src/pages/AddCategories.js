import { useState, useEffect } from 'react';
import CategoryForm from "../../components/CategoryForm";
import UpdateCategoryModal from "../../components/UpdateCategoryModal";
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify';


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
  
  const handleDelete = async (categoryId) => {
    const res = await fetch(`/api/categories/${categoryId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchCategories(); // Re-fetch categories after deletion
      toast.success('item deleted successful')
    } else {
      toast.error('Failed to delete category');
    }
  };

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
      <CategoriesTable categories={parentCategories} onRowClick={handleRowClick} handleDelete={handleDelete} />
      <h2>Subcategories</h2>
      <CategoriesTable categories={subCategories} onRowClick={handleRowClick} handleDelete={handleDelete} />
      {isModalOpen && selectedCategory && (
        <UpdateCategoryModal 
          category={selectedCategory} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

const CategoriesTable = ({ categories, onRowClick, handleDelete }) => {
  return (
    <Table className="table table-success table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Parent Category</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map(category => (
          
          <tr key={category._id}>
            <td onClick={() => onRowClick(category)}>{category.name}</td>
            <td onClick={() => onRowClick(category)}>{category.parent_id ? category.parent_id.name : 'None'}</td>
            <td onClick={() => onRowClick(category)}>
              {category.images ? (
                <img src ={`images/uploads/categories/${category.images[0].urls}`} alt={category.name} width="50" />
              ) : (
                'No Image'
              )}
            </td>
            <td>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(category._id); }} className="btn btn-danger">
                Delete  
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AddCategories;
