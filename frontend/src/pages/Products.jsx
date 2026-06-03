import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchProducts, deleteProduct } from '../redux/slices/productSlice';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency, getStockBadgeClass } from '../utils/formatters';
import { showSuccess, handleApiError } from '../services/toast.service';

const Products = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state) => state.products);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts()).unwrap().catch(handleApiError);
  }, [dispatch]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteProduct(deleteId)).unwrap();
      showSuccess('Product deleted successfully');
      setDeleteId(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading products..." />;

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your product inventory"
        actionLabel="+ Add Product"
        actionTo="/products/new"
      />

      {list.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No products yet"
          message="Add your first product to start managing inventory."
          action={<Link to="/products/new" className="btn btn-primary">Add Product</Link>}
        />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((product) => (
                  <tr key={product.id}>
                    <td><strong>{product.name}</strong></td>
                    <td><code>{product.sku}</code></td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>
                      <span className={`badge ${getStockBadgeClass(product.quantity)}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <Link to={`/products/${product.id}/edit`} className="btn btn-sm btn-secondary">
                        Edit
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setDeleteId(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default Products;
