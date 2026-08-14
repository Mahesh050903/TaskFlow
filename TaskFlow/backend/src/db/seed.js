const db = require("./database");

console.log("Starting seed...");

// Clear existing data
db.prepare("DELETE FROM tasks").run();
db.prepare("DELETE FROM columns").run();
db.prepare("DELETE FROM boards").run();

// Reset AUTOINCREMENT IDs
db.prepare("DELETE FROM sqlite_sequence").run();

// Create board
const boardResult = db
    .prepare("INSERT INTO boards (name) VALUES (?)")
    .run("TaskFlow Board");

const boardId = boardResult.lastInsertRowid;

// Create columns
const columnInsert = db.prepare(`
    INSERT INTO columns (board_id, name, position)
    VALUES (?, ?, ?)
`);

const todo = columnInsert.run(boardId, "To Do", 1);
const inProgress = columnInsert.run(boardId, "In Progress", 2);
const done = columnInsert.run(boardId, "Done", 3);

// Create tasks
const taskInsert = db.prepare(`
    INSERT INTO tasks
    (column_id, title, description, priority)
    VALUES (?, ?, ?, ?)
`);

taskInsert.run(
    todo.lastInsertRowid,
    "Create dashboard UI",
    "Build the main TaskFlow dashboard",
    "High"
);

taskInsert.run(
    todo.lastInsertRowid,
    "Create API",
    "Create backend API endpoints",
    "Medium"
);

taskInsert.run(
    inProgress.lastInsertRowid,
    "Connect frontend",
    "Connect React frontend with Express backend",
    "High"
);

taskInsert.run(
    done.lastInsertRowid,
    "Setup React",
    "Create React and Vite project",
    "Low"
);

taskInsert.run(
    done.lastInsertRowid,
    "Setup database",
    "Create SQLite database and schema",
    "High"
);

console.log("Seed data inserted successfully!");