import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { createProduct } from '../redux/slices/productSlice';
import PageHeader from '../components/PageHeader';
import ProductForm from '../components/ProductForm';
import { showSuccess, handleApiError } from '../services/toast.service';

const AddProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await dispatch(createProduct(data)).unwrap();
      showSuccess('Product created successfully');
      navigate('/products');
    } catch (error) {
      handleApiError(error, 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Add Product" subtitle="Create a new product in inventory" />
      <div className="card card-form">
        <ProductForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Product" />
      </div>
    </div>
  );
};

export default AddProduct;
