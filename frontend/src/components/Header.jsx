const Header = ({ onMenuClick, title }) => {
  return (
    <header className="header">
      <button className="menu-btn" onClick={onMenuClick} aria-label="Open menu">
        ☰
      </button>
      <h1 className="header-title">{title || 'Inventory Management'}</h1>
    </header>
  );
};

export default Header;
