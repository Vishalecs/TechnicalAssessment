import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchOrderById, clearCurrentOrder } from '../redux/slices/orderSlice';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatDate } from '../utils/formatters';
import { handleApiError } from '../services/toast.service';

const statusColors = {
  pending: 'badge-warning',
  confirmed: 'badge-primary',
  shipped: 'badge-info',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
};

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { current: order, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id)).unwrap().catch(handleApiError);
    return () => dispatch(clearCurrentOrder());
  }, [dispatch, id]);

  if (loading) return <LoadingSpinner text="Loading order details..." />;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!order) return null;

  return (
    <div>
      <PageHeader
        title={`Order #${order.id}`}
        subtitle={`Placed on ${formatDate(order.createdAt)}`}
      />

      <div className="detail-grid">
        <div className="card">
          <h3>Customer Information</h3>
          <dl className="detail-list">
            <dt>Name</dt>
            <dd>{order.customer?.fullName}</dd>
            <dt>Email</dt>
            <dd>{order.customer?.email}</dd>
            <dt>Phone</dt>
            <dd>{order.customer?.phone || '—'}</dd>
          </dl>
        </div>

        <div className="card">
          <h3>Order Summary</h3>
          <dl className="detail-list">
            <dt>Status</dt>
            <dd>
              <span className={`badge ${statusColors[order.status] || 'badge-secondary'}`}>
                {order.status}
              </span>
            </dd>
            <dt>Total Amount</dt>
            <dd className="total-amount">{formatCurrency(order.totalAmount)}</dd>
            <dt>Created</dt>
            <dd>{formatDate(order.createdAt)}</dd>
          </dl>
        </div>
      </div>

      <div className="card">
        <h3>Order Items</h3>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.product?.name}</strong></td>
                  <td><code>{item.product?.sku}</code></td>
                  <td>{formatCurrency(item.unitPrice)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatCurrency(parseFloat(item.unitPrice) * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="text-right"><strong>Total</strong></td>
                <td><strong>{formatCurrency(order.totalAmount)}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <Link to="/orders" className="btn btn-secondary">← Back to Orders</Link>
    </div>
  );
};

export default OrderDetails;
