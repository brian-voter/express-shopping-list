const express = require("express");
const { NotFoundError } = require("./expressError");
const app = express();
const morgan = require("morgan");

//TODO: rename:
const itemRoutes = require("./itemRoutes");

app.use(express.json());

// this applies to all requests at all paths
app.use(morgan('dev'));

//TODO: rename:
app.use("/items", itemRoutes);




/** 404 handler: matches unmatched routes; raises NotFoundError. */
app.use(function (req, res) {
    throw new NotFoundError();
});

/** Error handler: logs stacktrace and returns JSON error message. */
app.use(function (err, req, res, next) {
    const status = err.status || 500;
    const message = err.message;
    if (process.env.NODE_ENV !== "test") console.error(status, err.stack);
    return res.status(status).json({ error: { message, status } });
});


module.exports = app;