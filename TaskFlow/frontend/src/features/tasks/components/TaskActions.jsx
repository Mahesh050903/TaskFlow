function TaskActions({
  task,
  onEdit,
  onDelete,
}) {
  return (
    <div className="task-actions">
      <button
        type="button"
        className="task-action-btn task-edit-btn"
        onClick={() => onEdit(task)}
        aria-label={`Edit ${task.title}`}
      >
        <span className="action-icon">✎</span>
        <span>Edit</span>
      </button>

      <button
        type="button"
        className="task-action-btn task-delete-btn"
        onClick={() => onDelete(task)}
        aria-label={`Delete ${task.title}`}
      >
        <span className="action-icon">🗑</span>
        <span>Delete</span>
      </button>
    </div>
  );
}

export default TaskActions;