import { useMemo, useState, useEffect } from "react";
import "./App.css";

import Board from "./features/board/components/Board";
import TaskModal from "./features/tasks/components/TaskModal";
import SettingsModal from "./features/settings/SettingsModal";

import { useBoard } from "./features/board/hooks/useBoard";
import {
  createTask,
  updateTask,
  deleteTask,
  moveTask,
} from "./features/tasks/services/taskApi";

const BOARD_ID = 1;

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function App() {
  const {
    board,
    loading,
    error,
    reloadBoard,
    moveTaskInBoard,
    addTaskToBoard,
    updateTaskInBoard,
    deleteTaskFromBoard,
  } = useBoard(BOARD_ID);

  const [modalMode, setModalMode] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [targetColumnId, setTargetColumnId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("taskflow_theme") === "dark";
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("taskflow_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("taskflow_theme", "light");
    }
  }, [darkMode]);

  const handleCreateTask = async (taskData) => {
    addTaskToBoard(taskData);
    try {
      await createTask(taskData);
    } catch (err) {
      console.warn("Backend API createTask error:", err);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    updateTaskInBoard(taskId, taskData);
    try {
      await updateTask(taskId, taskData);
    } catch (err) {
      console.warn("Backend API updateTask error:", err);
    }
  };

  const handleDeleteTask = async (task) => {
    deleteTaskFromBoard(task.id);
    try {
      await deleteTask(task.id);
    } catch (err) {
      console.warn("Backend API deleteTask error:", err);
    }
  };

  const handleMoveTask = async (task, columnId) => {
    if (!columnId || Number(columnId) === Number(task.column_id)) {
      return;
    }

    moveTaskInBoard(task.id, columnId);

    try {
      await moveTask(task.id, columnId);
    } catch (err) {
      console.warn("Backend API moveTask error:", err);
    }
  };

  const openCreateModal = (columnId = null) => {
    setEditingTask(null);
    setTargetColumnId(columnId);
    setModalMode("create");
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingTask(null);
    setTargetColumnId(null);
  };

  const filteredBoard = useMemo(() => {
    if (!board) return null;

    const normalizedSearch = searchTerm.trim().toLowerCase();

    return {
      ...board,
      columns: board.columns?.map((column) => ({
        ...column,
        tasks: column.tasks?.filter((task) => {
          const matchesSearch =
            !normalizedSearch ||
            task.title?.toLowerCase().includes(normalizedSearch) ||
            task.description?.toLowerCase().includes(normalizedSearch);

          const matchesPriority =
            priorityFilter === "All" || task.priority === priorityFilter;

          return matchesSearch && matchesPriority;
        }),
      })),
    };
  }, [board, searchTerm, priorityFilter]);

  const totalTasks =
    board?.columns?.reduce(
      (total, column) => total + (column.tasks?.length || 0),
      0
    ) || 0;

  if (loading) {
    return (
      <div className="page-state">
        <div className="loading-spinner" />
        <p>Loading TaskFlow...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-state error-state">
        <div className="error-icon">!</div>
        <h2>Unable to load board</h2>
        <p>{error}</p>
        <button className="retry-button" onClick={reloadBoard}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <GridIcon />
          </div>
          <div className="sidebar-brand-text">
            <strong>TaskFlow</strong>
            <span>Workspace</span>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            title="Close sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <button
            className="sidebar-nav-item active"
            onClick={() => setSidebarOpen(false)}
          >
            <GridIcon />
            <span>Board</span>
          </button>

          <button
            className="sidebar-nav-item"
            onClick={() => {
              setSidebarOpen(false);
              setSettingsOpen(true);
            }}
          >
            <SettingsIcon />
            <span>Settings</span>
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="app-main">
        {/* HEADER */}
        <header className="app-header">
          <div className="header-left">
            <button
              type="button"
              className="menu-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>

            <div className="brand">
              <div className="brand-icon">
                <GridIcon />
              </div>

              <div className="brand-text">
                <h1>TaskFlow</h1>
                <span>{board?.name || "TaskFlow Board"}</span>
              </div>
            </div>
          </div>

          <div className="header-right">
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>

            <button
              type="button"
              className="add-task-button"
              onClick={openCreateModal}
            >
              <PlusIcon />
              <span>Add Task</span>
            </button>

            <button
              type="button"
              className="profile-button"
              onClick={() => setSettingsOpen(true)}
              title="Open Settings"
            >
              U
            </button>
          </div>
        </header>

        {/* TOOLBAR */}
        <section className="task-toolbar">
          <div className="search-box">
            <span className="search-icon">
              <SearchIcon />
            </span>

            <input
              type="search"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            {searchTerm && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="filter-container">
            <label htmlFor="priority-filter">Filter:</label>

            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </section>

        {/* BOARD WRAPPER */}
        <main className="board-wrapper">
          <section className="board-heading">
            <div>
              <h2>TaskFlow Board</h2>
              <p>Manage your tasks and keep your work moving.</p>
            </div>

            <div className="task-summary">
              <span>{totalTasks}</span>
              <small>Tasks</small>
            </div>
          </section>

          {/* BOARD */}
          <Board
            board={filteredBoard}
            onEditTask={openEditModal}
            onDeleteTask={handleDeleteTask}
            onMoveTask={handleMoveTask}
            onCreateTask={openCreateModal}
          />
        </main>

        {/* TASK MODAL */}
        {modalMode && (
          <TaskModal
            mode={modalMode}
            task={editingTask}
            columns={board?.columns || []}
            initialColumnId={targetColumnId}
            onClose={closeModal}
            onCreate={handleCreateTask}
            onUpdate={handleUpdateTask}
          />
        )}

        {/* SETTINGS MODAL */}
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          boardName={board?.name}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
        />
      </div>
    </div>
  );
}

export default App;