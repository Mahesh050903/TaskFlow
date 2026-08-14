const path = require("path");

const config = {
    env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000,
    dbPath: process.env.DATABASE_PATH || path.join(__dirname, "../../data/taskflow.db"),
};

module.exports = config;
