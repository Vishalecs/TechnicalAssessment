import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchCustomers, deleteCustomer } from '../redux/slices/customerSlice';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate } from '../utils/formatters';
import { showSuccess, handleApiError } from '../services/toast.service';

const Customers = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state) => state.customers);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers()).unwrap().catch(handleApiError);
  }, [dispatch]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await dispatch(deleteCustomer(deleteId)).unwrap();
      showSuccess('Customer deleted successfully');
      setDeleteId(null);
    } catch (error) {
      handleApiError(error);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading customers..." />;

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Manage your customer database"
        actionLabel="+ Add Customer"
        actionTo="/customers/new"
      />

      {list.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No customers yet"
          message="Add customers to start creating orders."
          action={<Link to="/customers/new" className="btn btn-primary">Add Customer</Link>}
        />
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((customer) => (
                  <tr key={customer.id}>
                    <td><strong>{customer.fullName}</strong></td>
                    <td>{customer.email}</td>
                    <td>{customer.phone || '—'}</td>
                    <td>{formatDate(customer.createdAt)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => setDeleteId(customer.id)}
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
        title="Delete Customer"
        message="Are you sure? Customers with orders may cause issues."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default Customers;
