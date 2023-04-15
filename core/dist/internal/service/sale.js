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
    return await saleModel.select(request);
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
export default InitSaleService();
//# sourceMappingURL=sale.js.map