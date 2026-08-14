import { useState } from "react";

function AppHeader({
  boardName = "TaskFlow Board",
  onAddTask,
  searchValue = "",
  onSearchChange,
  filterValue = "All",
  onFilterChange,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="app-header">

        {/* LEFT SIDE */}
        <div className="header-left">

          {/* MENU BUTTON */}
          <button
            type="button"
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <span />
            <span />
            <span />
          </button>

          {/* LOGO */}
          <div className="brand">

            <div className="brand-icon">
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="brand-text">
              <h1>TaskFlow</h1>
              <span>{boardName}</span>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="header-right">

          {/* ADD TASK */}
          <button
            type="button"
            className="add-task-button"
            onClick={onAddTask}
          >
            <span className="add-icon">+</span>
            <span>Add Task</span>
          </button>

          {/* PROFILE */}
          <button
            type="button"
            className="profile-button"
            aria-label="Profile"
          >
            <span>U</span>
          </button>

        </div>
      </header>

      {/* =====================================================
          TOOLBAR
      ===================================================== */}
      <section className="task-toolbar">

        {/* SEARCH */}
        <div className="search-box">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            value={searchValue}
            onChange={(event) =>
              onSearchChange?.(event.target.value)
            }
            placeholder="Search tasks..."
            aria-label="Search tasks"
          />

          {searchValue && (
            <button
              type="button"
              className="search-clear"
              onClick={() =>
                onSearchChange?.("")
              }
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>

        {/* FILTER */}
        <div className="filter-container">

          <label htmlFor="task-filter">
            Filter
          </label>

          <select
            id="task-filter"
            value={filterValue}
            onChange={(event) =>
              onFilterChange?.(event.target.value)
            }
          >
            <option value="All">
              All
            </option>

            <option value="Low">
              Low Priority
            </option>

            <option value="Medium">
              Medium Priority
            </option>

            <option value="High">
              High Priority
            </option>
          </select>

        </div>
      </section>

      {/* =====================================================
          SIDEBAR OVERLAY
      ===================================================== */}
      <div
        className={`sidebar-overlay ${
          sidebarOpen ? "visible" : ""
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* =====================================================
          SLIDE LEFT SIDEBAR
      ===================================================== */}
      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >

        {/* SIDEBAR HEADER */}
        <div className="sidebar-header">

          <div className="sidebar-brand">

            <div className="brand-icon small">
              <span />
              <span />
              <span />
              <span />
            </div>

            <strong>
              TaskFlow
            </strong>

          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            ×
          </button>

        </div>

        {/* SIDEBAR CONTENT */}
        <nav className="sidebar-navigation">

          <button
            type="button"
            className="sidebar-item active"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sidebar-item-icon">
              ▦
            </span>

            <span>
              Board
            </span>
          </button>

          <button
            type="button"
            className="sidebar-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sidebar-item-icon">
              ✓
            </span>

            <span>
              My Tasks
            </span>
          </button>

          <button
            type="button"
            className="sidebar-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sidebar-item-icon">
              ★
            </span>

            <span>
              Favorites
            </span>
          </button>

          <div className="sidebar-divider" />

          <p className="sidebar-section-title">
            WORKSPACE
          </p>

          <button
            type="button"
            className="sidebar-item"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="sidebar-item-icon">
              ⚙
            </span>

            <span>
              Settings
            </span>
          </button>

        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="sidebar-footer">

          <div className="user-avatar">
            U
          </div>

          <div className="user-info">
            <strong>
              User
            </strong>

            <span>
              TaskFlow Member
            </span>
          </div>

        </div>

      </aside>
    </>
  );
}

export default AppHeader;