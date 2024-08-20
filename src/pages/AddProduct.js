import React, { useState, useEffect } from 'react';
import { Table, Button } from '@mui/material';
import { toast } from 'react-toastify';
import ProductFormModal from '../../components/ProductFormModal';
const AddProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const fetchProducts = async () => {
    const res = await fetch('/api/products');
    const data = await res.json();
    if (data.success) {
      setProducts(data.data);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setShowFormModal(true);
  };

  const handleDelete = async (productId) => {
    const res = await fetch(`/api/products/${productId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      fetchProducts(); // Re-fetch products after deletion
      toast.success('Product deleted successfully');
    } else {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end mb-3">
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setShowFormModal(true)}
        >
          Add Product
        </Button>
      </div>
      <h2>Products</h2>
      <ProductsTable 
        products={products} 
        handleRowClick={handleRowClick} 
        handleDelete={handleDelete} 
      />
      <ProductFormModal 
        open={showFormModal} 
        handleClose={() => setShowFormModal(false)} 
        fetchProducts={fetchProducts} 
        productToEdit={selectedProduct} 
      />
    </div>
  );
};

const ProductsTable = ({ products, handleRowClick, handleDelete }) => {
  return (
    <Table className="table table-success table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Image</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product._id} onClick={() => handleRowClick(product)} style={{ cursor: 'pointer' }}>
            <td>{product.name}</td>
            <td>{product.category?.name || 'None'}</td>
            <td>
              {product.colors && product.colors.length > 0 ? (
                product.colors.map(color => (
                  <div key={color.color} style={{ marginBottom: '10px' }}>
                    <strong>{color.color}</strong>
                    <div>
                      {color.images && color.images.length > 0 ? (
                        color.images.map(imageId => (
                          <img 
                            key={imageId} 
                            src={`images/uploads/products/${imageId.urls[0]}`} 
                            alt={`${product.name} - ${color.color}`} 
                            width="50" 
                            style={{ marginRight: '5px' }}
                          />
                        ))
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <span>No Image</span>
              )}
            </td>
            <td>${product.details.price}</td>
            <td>
              <Button 
                onClick={() => handleDelete(product._id)} 
                variant="contained" 
                color="error"
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AddProducts;
