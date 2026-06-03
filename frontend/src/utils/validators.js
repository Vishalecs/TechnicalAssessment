export const validateProduct = (data) => {
  const errors = {};
  if (!data.name?.trim()) errors.name = 'Product name is required';
  if (!data.sku?.trim()) errors.sku = 'SKU is required';
  if (data.price === '' || data.price === undefined || parseFloat(data.price) < 0) {
    errors.price = 'Price must be a non-negative number';
  }
  if (data.quantity !== '' && parseInt(data.quantity, 10) < 0) {
    errors.quantity = 'Quantity cannot be negative';
  }
  return errors;
};

export const validateCustomer = (data) => {
  const errors = {};
  if (!data.fullName?.trim()) errors.fullName = 'Full name is required';
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email format';
  }
  return errors;
};

export const validateOrder = (customerId, items) => {
  const errors = {};
  if (!customerId) errors.customerId = 'Please select a customer';
  if (!items || items.length === 0) {
    errors.items = 'Add at least one product to the order';
  } else {
    const invalidItems = items.some(
      (item) => !item.productId || !item.quantity || item.quantity < 1
    );
    if (invalidItems) errors.items = 'All items must have a product and valid quantity';
  }
  return errors;
};
