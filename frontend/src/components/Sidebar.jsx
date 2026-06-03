import { NavLink } from 'react-router-dom';
import { IconDashboard, IconProducts, IconCustomers, IconOrders } from './Icons';

const navItems = [
  { to: '/', label: 'Dashboard', Icon: IconDashboard },
  { to: '/products', label: 'Products', Icon: IconProducts },
  { to: '/customers', label: 'Customers', Icon: IconCustomers },
  { to: '/orders', label: 'Orders', Icon: IconOrders },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand">
        <span className="brand-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </span>
        <div>
          <h2>Inventory</h2>
          <p>Management System</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        <p className="nav-section-label">Main Menu</p>
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <span className="nav-icon"><Icon /></span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
