import { useNavigate } from 'react-router-dom';
import './Banner.css';

const Banner = ({ title, description, buttonText, buttonAction, variant = 'default' }) => {
  const navigate = useNavigate();

  return (
    <div className={`banner-section banner-${variant}`}>
      <div className="banner-content">
        <div className="banner-text">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {buttonText && (
          <button 
            className="banner-btn"
            onClick={buttonAction || (() => navigate('/'))}
          >
            {buttonText} →
          </button>
        )}
      </div>
    </div>
  );
};

export default Banner;
