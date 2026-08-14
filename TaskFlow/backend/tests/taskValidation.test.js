const request = require("supertest");
const app = require("../src/app");
const db = require("../src/db/database");

describe("Task API Validation", () => {
    test("creating a task without a title should fail", async () => {
        const todoColumn = db
            .prepare("SELECT id FROM columns WHERE name = ?")
            .get("To Do");

        const response = await request(app)
            .post("/api/tasks")
            .send({
                columnId: todoColumn.id,
                title: "",
                description: "Task without title",
                priority: "High"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe("Title is required");
    });
});