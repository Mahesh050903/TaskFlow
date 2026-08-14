const express = require("express");
const cors = require("cors");

require("./db/database");

const taskRoutes = require("./routes/taskRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();


// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());


// =========================
// HOME ROUTE
// =========================

app.get("/", (req, res) => {
    res.json({
        message: "TaskFlow API is running"
    });
});


// =========================
// API ROUTES
// =========================

app.use("/api", taskRoutes);


// =========================
// ERROR HANDLING
// =========================

app.use(notFound);
app.use(errorHandler);


// =========================
// EXPORT APP
// =========================

module.exports = app;