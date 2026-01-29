const errorHandler = (err, req, res, next) => {
    // Log the error stack for debugging (not in production ideally, or structured logging)
    console.error(`[Error] ${err.message}`, err.stack);

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        // Stack trace only in development
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
