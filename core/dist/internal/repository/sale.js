import prisma from "../../unitls/prisma.js";
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
    return prisma.sale.findMany({
        where: {
            time: {
                lte: request.fromTime,
                gte: request.toTime,
            },
        },
    });
};
const create = async (request) => {
    return prisma.sale.create({
        data: {
            barcode: request.barcode,
            quantity: request.quantity,
            price: request.price,
            time: request.supplyTime,
        },
    });
};
const updateById = async (request) => {
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
const deleteById = async (id) => {
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