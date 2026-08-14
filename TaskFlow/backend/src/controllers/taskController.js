const taskService = require("../services/taskService");

// GET BOARD
function getBoard(req, res, next) {
    try {
        const boardId = req.params.boardId;

        if (!boardId) {
            return res.status(400).json({
                error: "Invalid board ID"
            });
        }

        const board = taskService.getBoardById(boardId);

        if (!board) {
            return res.status(404).json({
                error: "Board not found"
            });
        }

        res.status(200).json(board);
    } catch (error) {
        next(error);
    }
}

// GET TASKS
function listTasks(req, res, next) {
    try {
        const search = req.query.search || "";
        const priority = req.query.priority || "";

        const allowedPriorities = ["Low", "Medium", "High"];

        if (priority && !allowedPriorities.includes(priority)) {
            return res.status(400).json({
                error: "Invalid priority"
            });
        }

        const tasks = taskService.getTasks({
            search,
            priority
        });

        res.status(200).json({
            count: tasks.length,
            tasks
        });
    } catch (error) {
        next(error);
    }
}

// CREATE TASK
function createTask(req, res, next) {
    try {
        const { columnId, title, description, priority } = req.body;

        if (!columnId) {
            return res.status(400).json({
                error: "Column is required"
            });
        }

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                error: "Title is required"
            });
        }

        const taskPriority = priority || "Medium";
        const allowedPriorities = ["Low", "Medium", "High"];

        if (!allowedPriorities.includes(taskPriority)) {
            return res.status(400).json({
                error: "Invalid priority"
            });
        }

        const task = taskService.createTask({
            columnId,
            title: title.trim(),
            description,
            priority: taskPriority
        });

        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
}

// UPDATE TASK
function updateTask(req, res, next) {
    try {
        const taskId = req.params.taskId;
        const { title, description, priority, columnId } = req.body;

        if (!taskId) {
            return res.status(400).json({
                error: "Invalid task ID"
            });
        }

        // If move request is sent via PUT
        if (columnId && !title) {
            const movedTask = taskService.moveTask(taskId, columnId);
            if (!movedTask) {
                return res.status(404).json({
                    error: "Task or Column not found"
                });
            }
            return res.status(200).json(movedTask);
        }

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                error: "Title is required"
            });
        }

        const allowedPriorities = ["Low", "Medium", "High"];
        if (priority && !allowedPriorities.includes(priority)) {
            return res.status(400).json({
                error: "Invalid priority"
            });
        }

        const task = taskService.updateTask(taskId, {
            title: title.trim(),
            description,
            priority: priority || "Medium"
        });

        if (!task) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

// DELETE TASK
function deleteTask(req, res, next) {
    try {
        const taskId = req.params.taskId;

        if (!taskId) {
            return res.status(400).json({
                error: "Invalid task ID"
            });
        }

        const deleted = taskService.deleteTask(taskId);

        if (!deleted) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        next(error);
    }
}

// MOVE TASK
function moveTask(req, res, next) {
    try {
        const taskId = req.params.taskId;
        const columnId = req.body.columnId;

        if (!taskId) {
            return res.status(400).json({
                error: "Invalid task ID"
            });
        }

        if (!columnId) {
            return res.status(400).json({
                error: "Invalid column ID"
            });
        }

        const task = taskService.moveTask(taskId, columnId);

        if (task === null) {
            return res.status(404).json({
                error: "Column not found"
            });
        }

        if (task === false) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getBoard,
    listTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask
};