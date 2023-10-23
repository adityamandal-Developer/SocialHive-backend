const globalErrHandler = (err, req, res, next) => {
    //status
    const status = err?.status ? err?.status : 'failed';
    //message
    const message = err?.message;
    //stack
    const stack = err?.stack;
    res.status(500).json({
        status,
        message,
        stack,
    })
}

// Not found 
const notFound = (req, res, next) => {
    const err = new Error(`Cannot find ${req.originalUrl} on the server`);
    next(err)
}

module.exports = { notFound, globalErrHandler };