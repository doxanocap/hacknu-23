import { NextFunction, Request, Response } from "express";
import { createRM, getRM, updateRM } from "../../model/request.js";
import saleService from "../service/sale.js";
interface ISaleController {
    getByParams: (req: Request, res: Response, next: NextFunction) => void;
    recordByParams: (req: Request, res: Response, next: NextFunction) => void;
    updateById: (req: Request, res: Response, next: NextFunction) => void;
    deleteById: (req: Request, res: Response, next: NextFunction) => void;
    getById: (req: Request, res: Response, next: NextFunction) => void;
}

const InitSaleController = (): ISaleController => {
    return {
        getByParams: getByParams,
        recordByParams: recordByParams,
        updateById: updateById,
        deleteById: deleteById,
        getById: getById,
    };
};

const getByParams = async (req: Request, res: Response, next: NextFunction) => {
    const request: getRM = {
        fromTime: req.body.fromTime,
        toTime: req.body.toTime,
        barcode: req.body.barcode,
    };

    const data = await saleService.select(request);
    res.status(200).send(data);
};

const recordByParams = async (req: Request, res: Response) => {
    const request: createRM = {
        barcode: req.body.barcode,
        price: req.body.price,
        quantity: req.body.quantity,
        supplyTime: req.body.supplyTime,
    };

    const id = await saleService.create(request);
    if (id) {
        throw { status: 500, message: "unable to create" };
    }

    res.status(200).send(id);
};

const updateById = async (req: Request, res: Response) => {
    const request: updateRM = {
        id: parseInt(req.query.id as string),
        barcode: req.body.barcode,
        price: req.body.price,
        quantity: req.body.quantity,
        supplyTime: req.body.supplyTime,
    };

    await saleService.updateById(request);
    res.status(200).send();
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.query.id as string);
    await saleService.deleteById(id);
    res.status(200).send();
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.query.id as string);
    const data = await saleService.deleteById(id);

    if (data === null) {
        throw { status: 404, message: "not found" };
    }
    res.status(200).send(data);
};

export default InitSaleController();
