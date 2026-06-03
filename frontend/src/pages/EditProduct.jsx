import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchProductById, updateProduct, clearCurrentProduct } from '../redux/slices/productSlice';
import PageHeader from '../components/PageHeader';
import ProductForm from '../components/ProductForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { showSuccess, handleApiError } from '../services/toast.service';

const EditProduct = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current, loading, error } = useAppSelector((state) => state.products);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id)).unwrap().catch(handleApiError);
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, id]);

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      await dispatch(updateProduct({ id, data })).unwrap();
      showSuccess('Product updated successfully');
      navigate('/products');
    } catch (error) {
      handleApiError(error, 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading product..." />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <PageHeader title="Edit Product" subtitle={`Editing: ${current?.name}`} />
      <div className="card card-form">
        <ProductForm
          initialData={current}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Update Product"
        />
      </div>
    </div>
  );
};

export default EditProduct;
