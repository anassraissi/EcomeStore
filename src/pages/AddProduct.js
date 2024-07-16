import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import UpdateProductModal from '../../components/UpdateProductModal';
import ProductForm from '../../components/ProductForm';

const AddProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        console.log(products); // Assuming data is structured with 'data' field containing products array
      } else {
        console.error('Failed to fetch products:', data.error);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };



  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchProducts();
      } else {
        console.error('Failed to delete product:', res.statusText);
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleRowClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    fetchProducts(); // Refetch products after modal is closed
  };

  return (
    <div>
      <ProductForm fetchProducts={fetchProducts} categories={categories} />
      <h2>Products</h2>
      <ProductsTable products={products} onRowClick={handleRowClick} handleDelete={handleDelete} />
      {isModalOpen && selectedProduct && (
        <UpdateProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          categories={categories}
        />
      )}
    </div>
  );
};

const ProductsTable = ({ products, onRowClick, handleDelete }) => {
  return (
    <Table className="table table-success table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Category</th>
          <th>Sex</th>
          <th>Images</th>
          <th>Stock</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(product => (
          <tr key={product._id}>
            <td onClick={() => onRowClick(product)}>{product.name}</td>
            <td onClick={() => onRowClick(product)}>{product.description}</td>
            <td onClick={() => onRowClick(product)}>{product.price}</td>
            <td onClick={() => onRowClick(product)}>{product.category.name}</td>
            <td onClick={() => onRowClick(product)}>{product.sex}</td>
            <td onClick={() => onRowClick(product)}>
              {product.imageUrls.map((url, index) => (
                <img key={index} src={url} alt={product.name} width="50" />
              ))}
            </td>
            <td onClick={() => onRowClick(product)}>{product.stock}</td>
            <td>
              <button onClick={(e) => { e.stopPropagation(); handleDelete(product._id); }} className="btn btn-danger">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default AddProduct;
