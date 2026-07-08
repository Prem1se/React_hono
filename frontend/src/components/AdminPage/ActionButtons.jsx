import './ActionButtons.css';

const ActionButtons = ({ onEdit, onDelete, editLabel = 'Редактировать', deleteLabel = 'Удалить' }) => {
  return (
    <div className="action-buttons">
      <button className="btn-edit" onClick={onEdit}>
        {editLabel}
      </button>
      <button className="btn-delete" onClick={onDelete}>
        {deleteLabel}
      </button>
    </div>
  );
};

export default ActionButtons;
