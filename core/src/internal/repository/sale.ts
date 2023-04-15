import { Sale } from "@prisma/client";
import { createRM, getRM, updateRM } from "../../model/request.js";
import prisma from "../../unitls/prisma.js";
interface ISaleRepo {
    select: (request: getRM) => Promise<Sale[]>;
    create: (requst: createRM) => Promise<Sale>;
    updateById: (requst: updateRM) => Promise<Sale>;
    deletById: (id: number) => Promise<Sale>;
    selectById: (id: number) => Promise<Sale | null>;
}

const InitSaleRepo = (): ISaleRepo => {
    return {
        select: select,
        create: create,
        updateById: updateById,
        deletById: deleteById,
        selectById: selectById,
    };
};

const select = async (request: getRM): Promise<Sale[]> => {
    return prisma.sale.findMany({
        where: {
            time: {
                lte: request.fromTime,
                gte: request.toTime,
            },
        },
    });
};

const create = async (request: createRM): Promise<Sale> => {
    return prisma.sale.create({
        data: {
            barcode: request.barcode,
            quantity: request.quantity,
            price: request.price,
            time: request.supplyTime,
        },
    });
};

const updateById = async (request: updateRM): Promise<Sale> => {
    return prisma.sale.update({
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

const deleteById = async (id: number): Promise<Sale> => {
    return prisma.sale.delete({
        where: {
            id: id,
        },
    });
};

const selectById = async (id: number): Promise<Sale | null> => {
    return prisma.sale.findUnique({
        where: {
            id: id,
        },
    });
};

export default InitSaleRepo();
