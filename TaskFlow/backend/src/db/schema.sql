-- Drop tables if they exist
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS columns;
DROP TABLE IF EXISTS boards;

-- Create boards table
CREATE TABLE boards (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create columns table
CREATE TABLE columns (
    id TEXT PRIMARY KEY,
    board_id TEXT NOT NULL,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE,
    UNIQUE(board_id, position)
);

-- Create tasks table
CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    column_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    position INTEGER NOT NULL,
    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_tasks_column_id ON tasks(column_id);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_columns_board_id ON columns(board_id);