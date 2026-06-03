import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { createCustomer } from '../redux/slices/customerSlice';
import PageHeader from '../components/PageHeader';
import CustomerForm from '../components/CustomerForm';
import { showSuccess, handleApiError } from '../services/toast.service';

const AddCustomer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await dispatch(createCustomer(data)).unwrap();
      showSuccess('Customer created successfully');
      navigate('/customers');
    } catch (error) {
      handleApiError(error, 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="Add Customer" subtitle="Register a new customer" />
      <div className="card card-form">
        <CustomerForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default AddCustomer;
