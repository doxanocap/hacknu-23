import { NextFunction, Request, Response } from "express";

interface IMiddlewares {
    errorHandler: (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
    ) => void;
    cover: (
        fn: (req: Request, res: Response, next: NextFunction) => void
    ) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

const InitMiddlewares = (): IMiddlewares => {
    return {
        errorHandler: errorHandler,
        cover: cover,
    };
};

const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log(err);
    const status = err.status;
    if (status !== undefined) {
        res.status(status).json(err);
        return;
    }

    res.status(500).json({ error: "Something went wrong" });
};

// to pass all errors from this router to global error handler
const cover =
    (fn: (req: Request, res: Response, next: NextFunction) => void) =>
    async (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

export default InitMiddlewares();
