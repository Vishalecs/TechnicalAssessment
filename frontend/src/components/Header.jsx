import { IconMenu } from './Icons';

const Header = ({ onMenuClick, title }) => {
  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Open menu">
        <IconMenu />
      </button>
      <div className="header-content">
        <h1 className="header-title">{title || 'Inventory Management'}</h1>
        <p className="header-subtitle">Manage products, customers & orders</p>
      </div>
    </header>
  );
};

export default Header;
