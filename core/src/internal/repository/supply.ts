import { Supply } from "../../model/market.js";
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
    const prev = await marginModel.findByBarcode(request.barcode);
    if (prev === null) {
        await marginModel.create(request, -1);
    } else {
        await marginModel.update({
            barcode: request.barcode,
            quantity: prev.quantity,
            revenue: prev.revenue,
            net_profit: prev.net_profit - request.price * request.quantity,
        });
    }

    return await prisma.supply.create({
        data: {
            barcode: request.barcode,
            quantity: request.quantity,
            price: request.price,
            time: new Date(request.time),
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

    const prev_margin = await marginModel.findByBarcode(prev.barcode);
    if (prev_margin === null) {
        throw { status: 404, message: "not found" };
    }

    const total = prev_margin.revenue + diff_price;
    const qty = prev_margin.quantity + diff_qty;
    await marginModel.update({
        barcode: request.barcode,
        quantity: qty,
        revenue: total,
        net_profit: total,
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

    const diff_price = prev.price;
    const diff_qty = prev.quantity;

    const prev_margin = await marginModel.findByBarcode(prev.barcode);
    if (prev_margin === null) {
        throw { status: 404, message: "not found" };
    }

    await marginModel.update({
        barcode: prev.barcode,
        quantity: prev_margin.quantity,
        revenue: prev_margin.revenue,
        net_profit: prev_margin.net_profit + diff_price * diff_qty,
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
