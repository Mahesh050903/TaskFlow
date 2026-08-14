const AppError = require("../utils/AppError");

function errorHandler(err, req, res, next) {


    let statusCode = 500;
    let errorMsg = "Internal Server Error";

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        errorMsg = err.message;
    } else if (err.type === "entity.parse.failed") {
        statusCode = 400;
        errorMsg = "Invalid JSON payload passed";
    }

    res.status(statusCode).json({
        error: errorMsg
    });
}

module.exports = errorHandler;
