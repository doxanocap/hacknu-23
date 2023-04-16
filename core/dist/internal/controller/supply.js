import supplyService from "../service/supply.js";
const InitSupplyController = () => {
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
    const data = await supplyService.select(request);
    res.status(200).json(data);
};
const recordByParams = async (req, res) => {
    const request = {
        barcode: req.body.barcode,
        price: req.body.price,
        quantity: req.body.quantity,
        time: req.body.supplyTime,
    };
    const id = await supplyService.create(request);
    if (id === null) {
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
    await supplyService.updateById(request);
    res.status(200).send();
};
const deleteById = async (req, res, next) => {
    const id = parseInt(req.params.id);
    await supplyService.deleteById(id);
    res.status(200).send();
};
const getById = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const data = await supplyService.deleteById(id);
    if (data === null) {
        throw { status: 404, message: "not found" };
    }
    res.status(200).send(JSON.stringify(data));
};
const bigIntToStr = (key, value) => {
    typeof value === "bigint" ? value.toString() + "n" : value;
};
export default InitSupplyController();
//# sourceMappingURL=supply.js.map