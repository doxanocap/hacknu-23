import { Supply } from "@prisma/client";

import { createRM, getRM, updateRM } from "../../model/request.js";
import prisma from "../../utils/prisma.js";
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
    return prisma.supply.create({
        data: {
            barcode: request.barcode,
            quantity: request.quantity,
            price: request.price,
            time: request.supplyTime,
        },
    });
};

const updateById = async (request: updateRM): Promise<Supply> => {
    return prisma.supply.update({
        data: {
            barcode: request.barcode,
            quantity: request.quantity,
            price: request.price,
            time: request.supplyTime,
        },
        where: {
            id: request.id,
        },
    });
};

const deleteById = async (id: number): Promise<Supply> => {
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
