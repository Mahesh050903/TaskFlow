const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const isTest = process.env.NODE_ENV === "test";
const dbPath = isTest
  ? path.join(__dirname, "../../test.db")
  : path.join(__dirname, "../../data.db");

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma("foreign_keys = ON");

// Initialize schema if tables don't exist
const schemaPath = path.join(__dirname, "schema.sql");
if (fs.existsSync(schemaPath)) {
  const schemaSql = fs.readFileSync(schemaPath, "utf-8");
  db.exec(schemaSql);
}

// Seed default board if empty
const boardCheck = db.prepare("SELECT count(*) as count FROM boards").get();
if (!boardCheck || boardCheck.count === 0) {
  const boardStmt = db.prepare("INSERT INTO boards (id, name) VALUES (1, 'TaskFlow Board')");
  boardStmt.run();

  const colStmt = db.prepare("INSERT INTO columns (id, board_id, name, position) VALUES (?, 1, ?, ?)");
  colStmt.run(1, "To Do", 1);
  colStmt.run(2, "In Progress", 2);
  colStmt.run(3, "Done", 3);

  const taskStmt = db.prepare(
    "INSERT INTO tasks (id, column_id, title, description, priority, position) VALUES (?, ?, ?, ?, ?, ?)"
  );
  taskStmt.run(
    101,
    1,
    "Design System Updates",
    "Refactor button and card tokens for modern dark & light contrast.",
    "High",
    1
  );
  taskStmt.run(
    102,
    1,
    "Setup API Endpoints",
    "Integrate board and task controllers with error handling.",
    "Medium",
    2
  );
  taskStmt.run(
    103,
    2,
    "Kanban Board Feature",
    "Add smooth interactions for managing task cards.",
    "High",
    1
  );
  taskStmt.run(
    104,
    3,
    "Project Initialization",
    "Setup Vite React frontend and Express backend repository.",
    "Low",
    1
  );
  taskStmt.run(
    105,
    3,
    "Setup Database Schema",
    "Create SQLite database schema and seed script.",
    "High",
    2
  );
}

module.exports = db;