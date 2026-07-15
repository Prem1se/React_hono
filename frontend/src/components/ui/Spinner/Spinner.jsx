import './Spinner.css';

const Spinner = ({ size = 'medium' }) => {
  const sizeClass = size === 'large' ? 'spinner-large' : 
                    size === 'small' ? 'spinner-small' : 'spinner-medium';
  
  return (
    <div className="spinner-container">
      <div className={`spinner ${sizeClass}`}>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
    </div>
  );
};

export default Spinner;
