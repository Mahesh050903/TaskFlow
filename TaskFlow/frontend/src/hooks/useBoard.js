import { useCallback, useEffect, useState } from "react";
import {
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} from "../features/tasks/services/taskApi";

export function useBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/tasks");

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error("Load tasks error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const addTask = async (task) => {
    try {
      const newTask = await createTask(task);

      setTasks((prev) => [...prev, newTask]);
      return newTask;
    } catch (err) {
      console.error("Create task error:", err);
      throw err;
    }
  };

  const editTask = async (id, updates) => {
    try {
      const updatedTask = await updateTask(id, updates);

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id || task.id === id
            ? updatedTask
            : task
        )
      );

      return updatedTask;
    } catch (err) {
      console.error("Update task error:", err);
      throw err;
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTask(id);

      setTasks((prev) =>
        prev.filter(
          (task) => task._id !== id && task.id !== id
        )
      );
    } catch (err) {
      console.error("Delete task error:", err);
      throw err;
    }
  };

  const moveTaskTo = async (id, status) => {
    try {
      const updatedTask = await moveTask(id, status);

      setTasks((prev) =>
        prev.map((task) =>
          task._id === id || task.id === id
            ? updatedTask
            : task
        )
      );

      return updatedTask;
    } catch (err) {
      console.error("Move task error:", err);
      throw err;
    }
  };

  return {
    tasks,
    setTasks,
    loading,
    error,
    loadTasks,
    addTask,
    editTask,
    removeTask,
    moveTask: moveTaskTo,
  };
}