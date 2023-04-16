import prisma from "../../utils/prisma.js";
import marginModel from "./margin.js";
const InitSaleRepo = () => {
    return {
        select: select,
        create: create,
        updateById: updateById,
        deletById: deleteById,
        selectById: selectById,
    };
};
const select = async (request) => {
    return await prisma.sale.findMany({
        where: {
            time: {
                lte: request.toTime.toISOString(),
                gte: request.fromTime.toISOString(),
            },
        },
    });
};
const create = async (request) => {
    const prev = await marginModel.findByBarcode(request.barcode);
    if (prev === null) {
        await marginModel.create(request, 1);
    }
    else {
        await marginModel.update({
            barcode: request.barcode,
            quantity: prev.quantity + request.quantity,
            revenue: prev.revenue + request.quantity * request.price,
            net_profit: prev.net_profit + request.quantity * request.price,
        });
    }
    return await prisma.sale.create({
        data: {
            barcode: request.barcode,
            quantity: request.quantity,
            price: request.price,
            time: new Date(request.time),
        },
    });
};
const updateById = async (request) => {
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
const deleteById = async (id) => {
    const prev = await selectById(id);
    if (prev === null) {
        throw { status: 404, message: "not found" };
    }
    const prev_margin = await marginModel.findByBarcode(prev.barcode);
    if (prev_margin === null) {
        throw { status: 404, message: "not found" };
    }
    await marginModel.update({
        barcode: prev.barcode,
        quantity: prev_margin.quantity - prev.quantity,
        revenue: prev_margin.revenue - prev.price * prev.quantity,
        net_profit: prev_margin.net_profit - prev.price * prev.quantity,
    });
    return prisma.sale.delete({
        where: {
            id: id,
        },
    });
};
const selectById = async (id) => {
    return prisma.sale.findUnique({
        where: {
            id: id,
        },
    });
};
export default InitSaleRepo();
//# sourceMappingURL=sale.js.map