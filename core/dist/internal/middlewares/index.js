const InitMiddlewares = () => {
    return {
        errorHandler: errorHandler,
        cover: cover,
    };
};
const errorHandler = (err, req, res, next) => {
    console.log(err);
    const status = err.status;
    if (status !== undefined) {
        res.status(status).json(err);
        return;
    }
    res.status(500).json({ error: "Something went wrong" });
};
// to pass all errors from this router to global error handler
const cover = (fn) => async (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
export default InitMiddlewares();
//# sourceMappingURL=index.js.map