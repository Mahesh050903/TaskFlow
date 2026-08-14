const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db/database");

describe("Task Move API", () => {
    test("moving a task from To Do to In Progress should persist", async () => {
        const todoColumn = db
            .prepare("SELECT id FROM columns WHERE name = ?")
            .get("To Do");

        const inProgressColumn = db
            .prepare("SELECT id FROM columns WHERE name = ?")
            .get("In Progress");

        // Create a test task
        const createResponse = await request(app)
            .post("/api/tasks")
            .send({
                columnId: todoColumn.id,
                title: "Move Test Task",
                description: "Testing task movement",
                priority: "Medium"
            });

        expect(createResponse.statusCode).toBe(201);

        const taskId = createResponse.body.id;

        // Move task
        const moveResponse = await request(app)
            .patch(`/api/tasks/${taskId}/column`)
            .send({
                columnId: inProgressColumn.id
            });

        expect(moveResponse.statusCode).toBe(200);
        expect(moveResponse.body.column_id).toBe(inProgressColumn.id);

        // Verify directly from SQLite
        const storedTask = db
            .prepare("SELECT column_id FROM tasks WHERE id = ?")
            .get(taskId);

        expect(storedTask.column_id).toBe(inProgressColumn.id);

        // Cleanup
        db.prepare("DELETE FROM tasks WHERE id = ?").run(taskId);
    });
});
