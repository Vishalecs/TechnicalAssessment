import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchCustomers } from '../redux/slices/customerSlice';
import { fetchProducts } from '../redux/slices/productSlice';
import { createOrder } from '../redux/slices/orderSlice';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import { showSuccess, handleApiError } from '../services/toast.service';

const CreateOrder = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list: customers, loading: customersLoading } = useAppSelector((s) => s.customers);
  const { list: products, loading: productsLoading } = useAppSelector((s) => s.products);

  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ productId: '', quantity: 1 }]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCustomers()).unwrap().catch(handleApiError);
    dispatch(fetchProducts()).unwrap().catch(handleApiError);
  }, [dispatch]);

  const addItem = () => {
    setItems((prev) => [...prev, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const getLineTotal = (item) => {
    const product = products.find((p) => p.id === parseInt(item.productId, 10));
    if (!product) return 0;
    return parseFloat(product.price) * (parseInt(item.quantity, 10) || 0);
  };

  const orderTotal = items.reduce((sum, item) => sum + getLineTotal(item), 0);

  const validate = () => {
    const newErrors = {};
    if (!customerId) newErrors.customerId = 'Select a customer';
    const validItems = items.filter((i) => i.productId && i.quantity > 0);
    if (validItems.length === 0) newErrors.items = 'Add at least one valid item';
    items.forEach((item, index) => {
      if (item.productId) {
        const product = products.find((p) => p.id === parseInt(item.productId, 10));
        if (product && product.quantity < parseInt(item.quantity, 10)) {
          newErrors[`item_${index}`] = `Only ${product.quantity} in stock for ${product.name}`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const payload = {
      customerId: parseInt(customerId, 10),
      items: items
        .filter((i) => i.productId && i.quantity > 0)
        .map((i) => ({
          productId: parseInt(i.productId, 10),
          quantity: parseInt(i.quantity, 10),
        })),
    };

    try {
      const order = await dispatch(createOrder(payload)).unwrap();
      showSuccess('Order created successfully');
      navigate(`/orders/${order.id}`);
    } catch (error) {
      handleApiError(error, 'Failed to create order');
    } finally {
      setSubmitting(false);
    }
  };

  if (customersLoading || productsLoading) {
    return <LoadingSpinner text="Loading data..." />;
  }

  return (
    <div>
      <PageHeader title="Create Order" subtitle="Place a new customer order" />

      <form className="card card-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="customerId">Customer *</label>
          <select
            id="customerId"
            value={customerId}
            onChange={(e) => {
              setCustomerId(e.target.value);
              setErrors((prev) => ({ ...prev, customerId: '' }));
            }}
            className={errors.customerId ? 'input-error' : ''}
          >
            <option value="">Select a customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName} ({c.email})
              </option>
            ))}
          </select>
          {errors.customerId && <span className="error-text">{errors.customerId}</span>}
        </div>

        <div className="order-items-section">
          <div className="section-header">
            <h3>Order Items</h3>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
              + Add Item
            </button>
          </div>
          {errors.items && <span className="error-text">{errors.items}</span>}

          {items.map((item, index) => (
            <div key={index} className="order-item-row">
              <div className="form-group flex-2">
                <label>Product</label>
                <select
                  value={item.productId}
                  onChange={(e) => updateItem(index, 'productId', e.target.value)}
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatCurrency(p.price)} (Stock: {p.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group flex-1">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                />
              </div>
              <div className="item-total">
                <label>Line Total</label>
                <p>{formatCurrency(getLineTotal(item))}</p>
              </div>
              {items.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-sm remove-item-btn"
                  onClick={() => removeItem(index)}
                >
                  ✕
                </button>
              )}
              {errors[`item_${index}`] && (
                <span className="error-text item-error">{errors[`item_${index}`]}</span>
              )}
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h3>Order Total: {formatCurrency(orderTotal)}</h3>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/orders')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
