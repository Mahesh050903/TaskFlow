import TaskCard from "../../tasks/components/TaskCard";

function Column({
  column,
  columns,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onCreateTask,
}) {
  const tasks = column?.tasks || [];
  const columnName = column?.name || "";

  return (
    <section className="board-column">
      {/* COLUMN HEADER */}
      <div className="column-header">
        <div className="column-title-wrapper">
          <span
            className={`column-indicator column-${String(columnName)
              .toLowerCase()
              .replace(/\s+/g, "-")}`}
          />
          <h3>{columnName}</h3>
        </div>

        <div className="column-header-actions">
          <button
            type="button"
            className="column-add-btn"
            onClick={() => onCreateTask && onCreateTask(column.id)}
            title={`Add task to ${columnName}`}
            aria-label={`Add task to ${columnName}`}
          >
            +
          </button>
          <span className="task-count">{tasks.length}</span>
        </div>
      </div>

      {/* TASKS */}
      <div className="column-tasks">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columns={columns}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMove={onMoveTask}
            />
          ))
        ) : (
          <button
            type="button"
            className="empty-column"
            onClick={() => onCreateTask && onCreateTask(column.id)}
            title={`Add task to ${columnName}`}
          >
            <div className="empty-column-icon">+</div>
            <p>No tasks</p>
          </button>
        )}
      </div>
    </section>
  );
}

export default Column;