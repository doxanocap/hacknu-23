import { Margin } from "../../model/market.js";
import { createRM, updateRM } from "../../model/request.js";
import prisma from "../../utils/prisma.js";

interface IMarginRepo {
    insert: (request: createRM, isPositive: number) => Promise<void>;
    create: (request: createRM, isPositive: number) => Promise<void>;
    update: (request: updateRM) => Promise<void>;
}

const InitMarginRepo = (): IMarginRepo => {
    return {
        insert: insert,
        create: create,
        update: update,
    };
};

const insert = async (request: createRM, isPositive: number): Promise<void> => {
    const prev = await findByBarcode(request.barcode);

    if (prev != null) {
        const total = isPositive * request.price * request.quantity;
        await prisma.margin.update({
            data: {
                quantity: prev.quantity + request.quantity,
                revenue: prev.revenue + total,
                net_profit: prev.net_profit + total,
            },
            where: {
                barcode: request.barcode,
            },
        });
        return;
    }

    await create(request, isPositive);
};

const create = async (request: createRM, isPositive: number): Promise<void> => {
    const total = isPositive * request.price * request.quantity;
    await prisma.margin.create({
        data: {
            barcode: request.barcode,
            quantity: request.quantity,
            revenue: total,
            net_profit: total,
        },
    });
};

const update = async (request: updateRM): Promise<void> => {
    const prev = await findByBarcode(request.barcode);
    if (prev === null) {
        throw { status: 404, message: "not found" };
    }

    const diff_price = prev?.revenue + request.price;
    const diff_qty = prev?.quantity + request.quantity;

    await prisma.margin.update({
        data: {
            quantity: diff_qty,
            revenue: prev?.revenue + diff_price,
            net_profit: prev?.net_profit + diff_price,
        },
        where: {
            barcode: request.barcode,
        },
    });
};

const findByBarcode = async (barcode: number): Promise<Margin | null> => {
    return await prisma.margin.findUnique({
        where: {
            barcode: barcode,
        },
    });
};

export default InitMarginRepo();
