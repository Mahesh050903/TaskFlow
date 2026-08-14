import Column from "./Column";

function Board({
  board,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onCreateTask,
}) {
  const columns = board?.columns || [];

  return (
    <main className="board">
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          columns={columns}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onMoveTask={onMoveTask}
          onCreateTask={onCreateTask}
        />
      ))}
    </main>
  );
}

export default Board;