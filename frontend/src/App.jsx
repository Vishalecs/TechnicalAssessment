import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import Orders from './pages/Orders';
import CreateOrder from './pages/CreateOrder';
import OrderDetails from './pages/OrderDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<AddProduct />} />
        <Route path="products/:id/edit" element={<EditProduct />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/new" element={<AddCustomer />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/new" element={<CreateOrder />} />
        <Route path="orders/:id" element={<OrderDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
