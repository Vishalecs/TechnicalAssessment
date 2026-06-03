import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, actionLabel, actionTo, onAction }) => {
  return (
    <div className="page-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {(actionLabel && actionTo) && (
        <Link to={actionTo} className="btn btn-primary">
          {actionLabel}
        </Link>
      )}
      {(actionLabel && onAction) && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default PageHeader;
