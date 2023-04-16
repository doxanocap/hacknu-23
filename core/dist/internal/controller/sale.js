import saleService from "../service/sale.js";
const InitSaleController = () => {
    return {
        getByParams: getByParams,
        recordByParams: recordByParams,
        updateById: updateById,
        deleteById: deleteById,
        getById: getById,
    };
};
const getByParams = async (req, res, next) => {
    const request = {
        fromTime: req.body.fromTime,
        toTime: req.body.toTime,
        barcode: req.body.barcode,
    };
    const data = await saleService.select(request);
    res.status(200).send(data);
};
const recordByParams = async (req, res) => {
    const request = {
        barcode: req.body.barcode,
        price: req.body.price,
        quantity: req.body.quantity,
        time: req.body.time,
    };
    const id = await saleService.create(request);
    if (id === undefined) {
        throw { status: 500, message: "unable to create" };
    }
    res.status(200).json(id);
};
const updateById = async (req, res) => {
    const request = {
        id: parseInt(req.query.id),
        barcode: req.body.barcode,
        price: req.body.price,
        quantity: req.body.quantity,
        time: req.body.supplyTime,
    };
    await saleService.updateById(request);
    res.status(200).json();
};
const deleteById = async (req, res, next) => {
    const id = parseInt(req.params.id);
    await saleService.deleteById(id);
    res.status(200).json();
};
const getById = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const data = await saleService.deleteById(id);
    if (data === null) {
        throw { status: 404, message: "not found" };
    }
    res.status(200).send(JSON.stringify(data));
};
export default InitSaleController();
//# sourceMappingURL=sale.js.map