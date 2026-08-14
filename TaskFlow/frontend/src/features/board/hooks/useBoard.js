import { useCallback, useEffect, useState } from "react";
import { getBoard } from "../../tasks/services/taskApi";

const DEFAULT_BOARD = {
  id: 1,
  name: "TaskFlow Board",
  columns: [
    {
      id: 1,
      name: "To Do",
      tasks: [
        {
          id: 101,
          title: "Design System Updates",
          description: "Refactor button and card tokens for modern dark & light contrast.",
          priority: "High",
          column_id: 1,
        },
        {
          id: 102,
          title: "Setup API Endpoints",
          description: "Integrate board and task controllers with error handling.",
          priority: "Medium",
          column_id: 1,
        },
      ],
    },
    {
      id: 2,
      name: "In Progress",
      tasks: [
        {
          id: 103,
          title: "Kanban Board Feature",
          description: "Add smooth interactions for managing task cards.",
          priority: "High",
          column_id: 2,
        },
      ],
    },
    {
      id: 3,
      name: "Done",
      tasks: [
        {
          id: 104,
          title: "Project Initialization",
          description: "Setup Vite React frontend and Express backend repository.",
          priority: "Low",
          column_id: 3,
        },
      ],
    },
  ],
};

function useBoard(boardId) {
  const [board, setBoard] = useState(DEFAULT_BOARD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBoard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBoard(boardId);
      if (data && data.columns) {
        setBoard(data);
      }
    } catch (err) {
      console.warn("Backend API not reachable, using initial board state.", err);
      setError("");
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  const moveTaskInBoard = useCallback((taskId, newColumnId) => {
    const targetColId = Number(newColumnId);
    setBoard((prevBoard) => {
      if (!prevBoard || !prevBoard.columns) return prevBoard;

      let movedTask = null;

      const updatedColumns = prevBoard.columns.map((col) => {
        const existingTask = col.tasks?.find((t) => t.id === taskId);
        if (existingTask) {
          movedTask = { ...existingTask, column_id: targetColId };
        }
        return {
          ...col,
          tasks: (col.tasks || []).filter((t) => t.id !== taskId),
        };
      });

      if (!movedTask) return prevBoard;

      const finalColumns = updatedColumns.map((col) => {
        if (col.id === targetColId) {
          return {
            ...col,
            tasks: [...(col.tasks || []), movedTask],
          };
        }
        return col;
      });

      return {
        ...prevBoard,
        columns: finalColumns,
      };
    });
  }, []);

  const addTaskToBoard = useCallback((newTask) => {
    setBoard((prevBoard) => {
      if (!prevBoard || !prevBoard.columns) return prevBoard;

      const columnId = Number(newTask.columnId || newTask.column_id || 1);
      const createdTask = {
        id: newTask.id || Date.now(),
        title: newTask.title,
        description: newTask.description || "",
        priority: newTask.priority || "Medium",
        column_id: columnId,
        created_at: newTask.created_at || new Date().toISOString(),
      };

      const updatedColumns = prevBoard.columns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            tasks: [...(col.tasks || []), createdTask],
          };
        }
        return col;
      });

      return {
        ...prevBoard,
        columns: updatedColumns,
      };
    });
  }, []);

  const updateTaskInBoard = useCallback((taskId, updates) => {
    setBoard((prevBoard) => {
      if (!prevBoard || !prevBoard.columns) return prevBoard;

      const updatedColumns = prevBoard.columns.map((col) => ({
        ...col,
        tasks: (col.tasks || []).map((t) =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
      }));

      return {
        ...prevBoard,
        columns: updatedColumns,
      };
    });
  }, []);

  const deleteTaskFromBoard = useCallback((taskId) => {
    setBoard((prevBoard) => {
      if (!prevBoard || !prevBoard.columns) return prevBoard;

      const updatedColumns = prevBoard.columns.map((col) => ({
        ...col,
        tasks: (col.tasks || []).filter((t) => t.id !== taskId),
      }));

      return {
        ...prevBoard,
        columns: updatedColumns,
      };
    });
  }, []);

  useEffect(() => {
    loadBoard();
  }, [loadBoard]);

  return {
    board,
    loading,
    error,
    reloadBoard: loadBoard,
    moveTaskInBoard,
    addTaskToBoard,
    updateTaskInBoard,
    deleteTaskFromBoard,
  };
}

export { useBoard };
export default useBoard;