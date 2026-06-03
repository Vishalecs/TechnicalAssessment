const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner" />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
