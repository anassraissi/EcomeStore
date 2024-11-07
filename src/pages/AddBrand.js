// pages/brands/index.js
import { useState, useEffect } from 'react';
import BrandForm from '../../components/BrandForm';
import UpdateBrandModal from '../../components/UpdateBrandModal';
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AddBrands = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBrands = async () => {
    const res = await fetch('/api/brands');
    const data = await res.json();
    if (data.success) {
      setBrands(data.data);
      console.log(data.data);
      
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleDelete = async (brandId) => {
    const res = await fetch(`/api/brands/${brandId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchBrands(); // Re-fetch brands after deletion
      toast.success('Brand deleted successfully');
    } else {
      toast.error('Failed to delete brand');
    }
  };

  const handleRowClick = (brand) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBrand(null);
    fetchBrands(); // Refresh brands after update
  };

  return (
    <div>
      <BrandForm fetchBrands={fetchBrands} />
      <h2>Brands</h2>
      <BrandsTable brands={brands} onRowClick={handleRowClick} handleDelete={handleDelete} />
      {isModalOpen && selectedBrand && (
        <UpdateBrandModal
          brand={selectedBrand}
          onClose={handleCloseModal}
          fetchBrands={fetchBrands}
        />
      )}
    </div>
  );
};

const BrandsTable = ({ brands, onRowClick, handleDelete }) => {
  
  return (
    <Table className="table table-success table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Image</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {brands.length >0  && brands.map((brand) => (
          <tr key={brand._id}>
            <td onClick={() => onRowClick(brand)}>{brand.name}</td>
            <td onClick={() => onRowClick(brand)}>{brand.CategoryId ? brand.CategoryId.name : 'None'}</td>
            <td onClick={() => onRowClick(brand)}>
              {brand.image.length >0 ? (
                <img src={`images/uploads/brands/${brand.image[0].urls}`} alt={brand.name} width="50" />
              ) : (
                'No Image'
              )}
            </td>
            <td>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(brand._id); }} className="btn btn-danger">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AddBrands;
