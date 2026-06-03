import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchDashboard } from '../redux/slices/dashboardSlice';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';
import { formatCurrency } from '../utils/formatters';
import { handleApiError } from '../services/toast.service';
import { getStockBadgeClass } from '../utils/formatters';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { stats, loading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard()).unwrap().catch(handleApiError);
  }, [dispatch]);

  if (loading) return <LoadingSpinner text="Loading dashboard..." />;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your inventory and orders" />

      <div className="stats-grid">
        <StatCard title="Total Products" value={stats?.totalProducts ?? 0} icon="📦" color="primary" />
        <StatCard title="Total Customers" value={stats?.totalCustomers ?? 0} icon="👥" color="success" />
        <StatCard title="Total Orders" value={stats?.totalOrders ?? 0} icon="🛒" color="warning" />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockProducts?.length ?? 0}
          icon="⚠️"
          color="danger"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Low Stock Products</h3>
          <span className="text-muted">Quantity &lt; 5</span>
        </div>
        {stats?.lowStockProducts?.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td><code>{product.sku}</code></td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>
                      <span className={`badge ${getStockBadgeClass(product.quantity)}`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td>
                      <Link to={`/products/${product.id}/edit`} className="btn btn-sm btn-secondary">
                        Restock
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="empty-message">All products are sufficiently stocked.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
