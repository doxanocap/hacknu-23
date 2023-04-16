import supplyModel from "../repository/supply.js";
const InitSupplyService = () => {
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
    const data = await supplyModel.select(request);
    return convertType(data);
};
const create = async (request) => {
    const data = await supplyModel.create(request);
    return data.id;
};
const updateById = async (request) => {
    await supplyModel.updateById(request);
    return;
};
const deleteById = async (id) => {
    await supplyModel.deletById(id);
    return;
};
const selectById = async (id) => {
    return supplyModel.selectById(id);
};
const convertType = (data) => {
    const res = [];
    data.forEach((item) => {
        const temp = {
            id: item.id,
            barcode: item.barcode,
            price: item.price,
            quantity: item.quantity,
            time: item.time,
        };
        res.push(temp);
    });
    return res;
};
export default InitSupplyService();
//# sourceMappingURL=supply.js.map