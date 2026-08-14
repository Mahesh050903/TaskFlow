const db = require("../src/db/database");
const taskService = require("../src/services/taskService");

describe("Task Queries API", () => {
    test("task count per column query should match seed data", () => {
        const counts = db
            .prepare(`
                SELECT
                    columns.name,
                    COUNT(tasks.id) AS task_count
                FROM columns
                LEFT JOIN tasks
                    ON tasks.column_id = columns.id
                GROUP BY columns.id, columns.name
                ORDER BY columns.position
            `)
            .all();

        expect(counts).toEqual([
            {
                name: "To Do",
                task_count: 2
            },
            {
                name: "In Progress",
                task_count: 1
            },
            {
                name: "Done",
                task_count: 2
            }
        ]);
    });

    test("getTaskCountsByColumn should return correct counts", () => {
        const board = db.prepare("SELECT id FROM boards LIMIT 1").get();
        const counts = taskService.getTaskCountsByColumn(board.id);
        
        expect(counts.length).toBe(3);
        expect(counts[0].name).toBe("To Do");
        expect(counts[0].task_count).toBe(2);
    });

    test("tasks by priority newest first should work", () => {
        const tasks = taskService.getTasks({ priority: "High" });
        expect(tasks.every(t => t.priority === "High")).toBe(true);

        // Check if sorted by created_at DESC
        if (tasks.length > 1) {
            const time1 = new Date(tasks[0].created_at).getTime();
            const time2 = new Date(tasks[1].created_at).getTime();
            expect(time1).toBeGreaterThanOrEqual(time2);
        }
    });
});
