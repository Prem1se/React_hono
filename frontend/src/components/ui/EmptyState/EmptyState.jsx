import './EmptyState.css';

const EmptyState = ({ icon, title, description, actionText, onAction }) => {
  return (
    <div className="empty-state">
      {icon && <div className="empty-icon">{icon}</div>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {actionText && onAction && (
        <button className="continue-shopping-btn" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
