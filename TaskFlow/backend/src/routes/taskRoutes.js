const express = require("express");

const taskController = require("../controllers/taskController");

const router = express.Router();


// =========================
// BOARD ROUTES
// =========================

// Get complete board
router.get(
    "/boards/:boardId",
    taskController.getBoard
);


// =========================
// TASK ROUTES
// =========================

// List all tasks / search / priority filter
router.get(
    "/tasks",
    taskController.listTasks
);


// Create task
router.post(
    "/tasks",
    taskController.createTask
);


// Update task
router.put(
    "/tasks/:taskId",
    taskController.updateTask
);


// Move task to another column
router.patch(
    "/tasks/:taskId/column",
    taskController.moveTask
);


// Delete task
router.delete(
    "/tasks/:taskId",
    taskController.deleteTask
);


module.exports = router;