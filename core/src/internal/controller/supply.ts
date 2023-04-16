import { NextFunction, Request, Response } from "express";
import { createRM, getRM, updateRM } from "../../model/request.js";
import supplyService from "../service/supply.js";

interface ISupplyController {
    getByParams: (req: Request, res: Response, next: NextFunction) => void;
    recordByParams: (req: Request, res: Response, next: NextFunction) => void;
    updateById: (req: Request, res: Response, next: NextFunction) => void;
    deleteById: (req: Request, res: Response, next: NextFunction) => void;
    getById: (req: Request, res: Response, next: NextFunction) => void;
}

const InitSupplyController = (): ISupplyController => {
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

    const data = await supplyService.select(request);
    res.status(200).json(data);
};

const recordByParams = async (req: Request, res: Response) => {
    const request: createRM = {
        barcode: req.body.barcode,
        price: req.body.price,
        quantity: req.body.quantity,
        time: req.body.supplyTime,
    };

    const id = await supplyService.create(request);
    if (id === null) {
        throw { status: 500, message: "unable to create" };
    }

    res.status(200).json(id);
};

const updateById = async (req: Request, res: Response) => {
    const request: updateRM = {
        id: parseInt(req.query.id as string),
        barcode: req.body.barcode,
        price: req.body.price,
        quantity: req.body.quantity,
        time: req.body.supplyTime,
    };

    await supplyService.updateById(request);
    res.status(200).send();
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string);

    await supplyService.deleteById(id);
    res.status(200).send();
};

const getById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string);
    const data = await supplyService.deleteById(id);

    if (data === null) {
        throw { status: 404, message: "not found" };
    }
    res.status(200).send(JSON.stringify(data));
};

const bigIntToStr = (key: any, value: any) => {
    typeof value === "bigint" ? value.toString() + "n" : value;
};

export default InitSupplyController();
