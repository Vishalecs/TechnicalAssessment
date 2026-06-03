import { useState, useEffect } from 'react';

const ProductForm = ({ initialData, onSubmit, loading, submitLabel = 'Save' }) => {
  const [form, setForm] = useState({
    name: '',
    sku: '',
    price: '',
    quantity: '0',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        sku: initialData.sku || '',
        price: String(initialData.price ?? ''),
        quantity: String(initialData.quantity ?? '0'),
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.sku.trim()) newErrors.sku = 'SKU is required';
    if (form.price === '' || parseFloat(form.price) < 0) newErrors.price = 'Valid price required';
    if (parseInt(form.quantity, 10) < 0) newErrors.quantity = 'Quantity cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10) || 0,
    });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Product Name *</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? 'input-error' : ''}
          placeholder="Enter product name"
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="sku">SKU *</label>
        <input
          id="sku"
          name="sku"
          value={form.sku}
          onChange={handleChange}
          className={errors.sku ? 'input-error' : ''}
          placeholder="e.g. PRD-001"
        />
        {errors.sku && <span className="error-text">{errors.sku}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price ($) *</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className={errors.price ? 'input-error' : ''}
            placeholder="0.00"
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity *</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            value={form.quantity}
            onChange={handleChange}
            className={errors.quantity ? 'input-error' : ''}
            placeholder="0"
          />
          {errors.quantity && <span className="error-text">{errors.quantity}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
