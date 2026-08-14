const db = require("../db/database");

// Get complete board with columns and tasks
function getBoardById(boardId) {
    const board = db
        .prepare(`
            SELECT id, name
            FROM boards
            WHERE id = ? OR id = CAST(? AS INTEGER)
        `)
        .get(boardId, boardId);

    if (!board) {
        return null;
    }

    const columns = db
        .prepare(`
            SELECT id, name, position
            FROM columns
            WHERE board_id = ? OR board_id = CAST(? AS INTEGER)
            ORDER BY position ASC
        `)
        .all(boardId, boardId);

    const taskQuery = db.prepare(`
        SELECT
            id,
            column_id,
            title,
            description,
            priority,
            created_at
        FROM tasks
        WHERE column_id = ? OR column_id = CAST(? AS INTEGER)
        ORDER BY created_at DESC
    `);

    const columnsWithTasks = columns.map((column) => {
        const tasks = taskQuery.all(column.id, column.id);
        return {
            ...column,
            tasks
        };
    });

    return {
        ...board,
        columns: columnsWithTasks
    };
}

// Get tasks with search and priority filter
function getTasks({ search, priority }) {
    let query = `
        SELECT
            tasks.id,
            tasks.column_id,
            tasks.title,
            tasks.description,
            tasks.priority,
            tasks.created_at,
            columns.name AS column_name
        FROM tasks
        JOIN columns
            ON tasks.column_id = columns.id
    `;

    const conditions = [];
    const params = [];

    if (search) {
        conditions.push(`(tasks.title LIKE ? OR tasks.description LIKE ?)`);
        const searchValue = `%${search}%`;
        params.push(searchValue, searchValue);
    }

    if (priority) {
        conditions.push(`tasks.priority = ?`);
        params.push(priority);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += ` ORDER BY tasks.created_at DESC`;

    return db.prepare(query).all(...params);
}

// Create a new task
function createTask({ columnId, title, description, priority }) {
    const taskId = Date.now().toString() + Math.floor(Math.random() * 1000);
    const posRow = db
        .prepare("SELECT COALESCE(MAX(position), 0) + 1 AS next_pos FROM tasks WHERE column_id = ? OR column_id = CAST(? AS INTEGER)")
        .get(columnId, columnId);
    const nextPos = posRow ? posRow.next_pos : 1;

    db.prepare(`
        INSERT INTO tasks
        (id, column_id, title, description, priority, position)
        VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(
        taskId,
        columnId,
        title.trim(),
        description || null,
        priority || "Medium",
        nextPos
    );

    return db
        .prepare(`
            SELECT id, column_id, title, description, priority, created_at
            FROM tasks
            WHERE id = ?
        `)
        .get(taskId);
}

// Update an existing task
function updateTask(taskId, { title, description, priority }) {
    const result = db
        .prepare(`
            UPDATE tasks
            SET title = ?, description = ?, priority = ?
            WHERE id = ? OR id = CAST(? AS INTEGER)
        `)
        .run(title.trim(), description || null, priority, taskId, taskId);

    if (result.changes === 0) {
        return null;
    }

    return db
        .prepare(`
            SELECT id, column_id, title, description, priority, created_at
            FROM tasks
            WHERE id = ? OR id = CAST(? AS INTEGER)
        `)
        .get(taskId, taskId);
}

// Delete a task
function deleteTask(taskId) {
    const result = db
        .prepare("DELETE FROM tasks WHERE id = ? OR id = CAST(? AS INTEGER)")
        .run(taskId, taskId);
    return result.changes > 0;
}

// Move task to another column
function moveTask(taskId, columnId) {
    const column = db
        .prepare("SELECT id FROM columns WHERE id = ? OR id = CAST(? AS INTEGER)")
        .get(columnId, columnId);

    if (!column) {
        return null;
    }

    const result = db
        .prepare("UPDATE tasks SET column_id = ? WHERE id = ? OR id = CAST(? AS INTEGER)")
        .run(column.id, taskId, taskId);

    if (result.changes === 0) {
        return false;
    }

    return db
        .prepare(`
            SELECT id, column_id, title, description, priority, created_at
            FROM tasks
            WHERE id = ? OR id = CAST(? AS INTEGER)
        `)
        .get(taskId, taskId);
}

// Get task counts per column for a given board
function getTaskCountsByColumn(boardId) {
    return db
        .prepare(`
            SELECT
                c.id,
                c.name,
                COUNT(t.id) AS task_count
            FROM columns c
            LEFT JOIN tasks t
                ON t.column_id = c.id
            WHERE c.board_id = ? OR c.board_id = CAST(? AS INTEGER)
            GROUP BY c.id, c.name
            ORDER BY c.position ASC
        `)
        .all(boardId, boardId);
}

module.exports = {
    getBoardById,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    getTaskCountsByColumn
};