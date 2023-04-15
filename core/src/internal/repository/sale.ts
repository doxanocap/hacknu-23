import { Sale } from "@prisma/client";
import { createRM, getRM, updateRM } from "../../model/request.js";
import prisma from "../../utils/prisma.js";
import marginModel from "./margin.js";
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
    await marginModel.create(request, 1);

    return await prisma.sale.create({
        data: {
            barcode: request.barcode,
            quantity: request.quantity,
            price: request.price,
            time: request.time,
        },
    });
};

const updateById = async (request: updateRM): Promise<Sale> => {
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

    return prisma.sale.update({
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

const deleteById = async (id: number): Promise<Sale> => {
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
