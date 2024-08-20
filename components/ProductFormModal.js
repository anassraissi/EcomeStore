import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ProductForm from './ProductForm'; // Adjust path as needed

const ProductFormModal = ({ open, handleClose, fetchProducts }) => {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <ProductForm fetchProducts={fetchProducts} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductFormModal;
