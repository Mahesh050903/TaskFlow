function TaskCard({
  task,
  columns = [],
  onEdit,
  onDelete,
  onMove,
}) {
  const priority = task?.priority || "Medium";
  const priorityClass = priority.toLowerCase();

  const handleMove = (e) => {
    const newColumnId = Number(e.target.value);
    if (newColumnId && onMove) {
      onMove(task, newColumnId);
    }
  };

  return (
    <article className="task-card">
      <div className="task-card-header">
        <h4 className="task-title">{task?.title}</h4>
      </div>

      {task?.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-card-footer">
        <span className={`task-priority ${priorityClass}`}>
          {priority}
        </span>

        <div className="task-actions">
          {columns && columns.length > 0 && (
            <select
              className="task-move-select"
              value={task?.column_id || ""}
              onChange={handleMove}
              aria-label="Move task column"
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          )}

          <button
            type="button"
            className="task-action-button edit-action"
            onClick={() => onEdit && onEdit(task)}
            title="Edit task"
          >
            ✎ Edit
          </button>

          <button
            type="button"
            className="task-action-button delete-action"
            onClick={() => onDelete && onDelete(task)}
            title="Delete task"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default TaskCard;