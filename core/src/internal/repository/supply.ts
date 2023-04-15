import { Supply } from "@prisma/client";

import { createRM, getRM, updateRM } from "../../model/request.js";
import prisma from "../../utils/prisma.js";
import marginModel from "./margin.js";

interface ISupplyRepo {
    select: (request: getRM) => Promise<Supply[]>;
    create: (requst: createRM) => Promise<Supply>;
    updateById: (requst: updateRM) => Promise<Supply>;
    deletById: (id: number) => Promise<Supply>;
    selectById: (id: number) => Promise<Supply | null>;
}

const InitSupplyRepo = (): ISupplyRepo => {
    return {
        select: select,
        create: create,
        updateById: updateById,
        deletById: deleteById,
        selectById: selectById,
    };
};

const select = async (request: getRM): Promise<Supply[]> => {
    return prisma.supply.findMany({
        where: {
            time: {
                lte: request.fromTime,
                gte: request.toTime,
            },
        },
    });
};

const create = async (request: createRM): Promise<Supply> => {
    await marginModel.create(request, -1);
    return await prisma.supply.create({
        data: {
            barcode: request.barcode,
            quantity: request.quantity,
            price: request.price,
            time: request.time,
        },
    });
};

const updateById = async (request: updateRM): Promise<Supply> => {
    const prev = await selectById(request.id);
    if (prev === null) {
        throw { status: 404, message: "not found" };
    }

    const diff_price = request.price - prev.price;
    const diff_qty = request.quantity - prev.quantity;

    await marginModel.update({
        id: 0,
        barcode: request.barcode,
        price: diff_price,
        quantity: diff_qty,
        time: new Date(),
    });

    return prisma.supply.update({
        data: {
            quantity: request.quantity,
            price: request.price,
            time: request.time,
        },
        where: {
            id: request.id,
        },
    });
};

const deleteById = async (id: number): Promise<Supply> => {
    const prev = await selectById(id);
    if (prev === null) {
        throw { status: 404, message: "not found" };
    }

    const diff_price = -prev.price;
    const diff_qty = -prev.quantity;

    await marginModel.update({
        id: 0,
        barcode: prev.barcode,
        price: diff_price,
        quantity: diff_qty,
        time: new Date(),
    });

    return prisma.supply.delete({
        where: {
            id: id,
        },
    });
};

const selectById = async (id: number): Promise<Supply | null> => {
    return prisma.supply.findUnique({
        where: {
            id: id,
        },
    });
};

export default InitSupplyRepo();
