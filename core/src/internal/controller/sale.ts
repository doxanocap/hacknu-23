import { NextFunction, Request, Response } from "express";

interface ISaleController {
    getByParams: (req: Request, res: Response, next: NextFunction) => void;
    recordByParams: (req: Request, res: Response, next: NextFunction) => void;
    updateByParams: (req: Request, res: Response, next: NextFunction) => void;
    deleteById: (req: Request, res: Response, next: NextFunction) => void;
    getById: (req: Request, res: Response, next: NextFunction) => void;
}

const InitSaleController = (): ISaleController => {
    return {
        getByParams: getByParams,
        recordByParams: recordByParams,
        updateByParams: updateByParams,
        deleteById: deleteById,
        getById: getById,
    };
};

const getByParams = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};

const recordByParams = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};

const updateByParams = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};
const deleteById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {};

const getById = async (req: Request, res: Response, next: NextFunction) => {};

export default InitSaleController();
