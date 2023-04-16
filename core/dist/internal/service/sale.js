import saleModel from "../repository/sale.js";
const InitSaleService = () => {
    return {
        select: select,
        create: create,
        updateById: updateById,
        deleteById: deleteById,
        selectById: selectById,
    };
};
const select = async (request) => {
    if (request.fromTime.toString() === "" &&
        request.toTime.toString() === "") {
        request.fromTime = new Date(0);
        request.toTime = new Date();
    }
    const data = await saleModel.select(request);
    return convertType(data);
};
const create = async (request) => {
    const data = await saleModel.create(request);
    return data.id;
};
const updateById = async (request) => {
    await saleModel.updateById(request);
    return;
};
const deleteById = async (id) => {
    await saleModel.deletById(id);
    return;
};
const selectById = async (id) => {
    return saleModel.selectById(id);
};
const convertType = (data) => {
    const res = [];
    data.forEach((item) => {
        const temp = {
            id: item.id,
            barcode: item.barcode.toString(),
            price: item.price,
            quantity: item.quantity,
            time: item.time,
        };
        res.push(temp);
    });
    return res;
};
export default InitSaleService();
//# sourceMappingURL=sale.js.map