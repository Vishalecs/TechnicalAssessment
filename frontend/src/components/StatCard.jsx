const StatCard = ({ title, value, icon, color = 'primary' }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-card-body">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
      <div className="stat-icon-wrap">{icon}</div>
    </div>
  );
};

export default StatCard;
