import { Margin } from "../../model/market.js";
import { createRM, updateMargin } from "../../model/request.js";
import prisma from "../../utils/prisma.js";

interface IMarginRepo {
    insert: (request: createRM, isPositive: number) => Promise<void>;
    create: (request: createRM, isPositive: number) => Promise<void>;
    update: (request: updateMargin) => Promise<void>;
    findByBarcode: (barcode: bigint) => Promise<Margin | null>;
}

const InitMarginRepo = (): IMarginRepo => {
    return {
        insert: insert,
        create: create,
        update: update,
        findByBarcode: findByBarcode,
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
    const prev = await findByBarcode(request.barcode);
    if (prev !== null) {
        return;
    }

    const qty = isPositive > 0 ? request.quantity : 0;
    const total_net = isPositive * request.price * request.quantity;
    const total_revenue = isPositive > 0 ? total_net : 0;

    await prisma.margin.create({
        data: {
            barcode: request.barcode,
            quantity: qty,
            revenue: total_revenue,
            net_profit: total_net,
        },
    });
};

const update = async (request: updateMargin): Promise<void> => {
    await prisma.margin.update({
        data: {
            quantity: request.quantity,
            revenue: request.revenue,
            net_profit: request.net_profit,
        },
        where: {
            barcode: request.barcode,
        },
    });
};

const findByBarcode = async (barcode: bigint): Promise<Margin | null> => {
    return await prisma.margin.findUnique({
        where: {
            barcode: barcode,
        },
    });
};

export default InitMarginRepo();
