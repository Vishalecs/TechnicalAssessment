import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchOrders, deleteOrder } from '../redux/slices/orderSlice';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency, formatDate } from '../utils/formatters';
import { showSuccess, handleApiError } from '../services/toast.service';

const statusColors = {
  pending: 'badge-warning',
  confirmed: 'badge-primary',
  shipped: 'badge-info',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
};

const Orders = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state) => state.orders);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchOrders()).unwrap().catch(handleApiError);
  }, [dispatch]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteOrder(deleteId)).unwrap();
      showSuccess('Order deleted successfully');
      setDeleteId(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading orders..." />;

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="View and manage customer orders"
        actionLabel="+ Create Order"
        actionTo="/orders/new"
      />

      {list.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="No orders yet"
          message="Create your first order to get started."
          action={<Link to="/orders/new" className="btn btn-primary">Create Order</Link>}
        />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((order) => (
                  <tr key={order.id}>
                    <td><strong>#{order.id}</strong></td>
                    <td>{order.customer?.fullName || '—'}</td>
                    <td>{order.items?.length ?? 0} item(s)</td>
                    <td>{formatCurrency(order.totalAmount)}</td>
                    <td>
                      <span className={`badge ${statusColors[order.status] || 'badge-secondary'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td className="actions-cell">
                      <Link to={`/orders/${order.id}`} className="btn btn-sm btn-secondary">
                        View
                      </Link>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setDeleteId(order.id)}
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
        title="Delete Order"
        message="Are you sure you want to delete this order?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default Orders;
