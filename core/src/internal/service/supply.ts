import { Supply, SupplyRes } from "../../model/market.js";
import { createRM, getRM, updateRM } from "../../model/request.js";
import supplyModel from "../repository/supply.js";

interface ISupplyService {
    select: (request: getRM) => Promise<SupplyRes[]>;
    create: (request: createRM) => Promise<number>;
    updateById: (request: updateRM) => Promise<void>;
    deleteById: (id: number) => Promise<void>;
    selectById: (id: number) => Promise<Supply | null>;
}

const InitSupplyService = (): ISupplyService => {
    return {
        select: select,
        create: create,
        updateById: updateById,
        deleteById: deleteById,
        selectById: selectById,
    };
};

const select = async (request: getRM): Promise<SupplyRes[]> => {
    if (
        request.fromTime.toString() === "" &&
        request.toTime.toString() === ""
    ) {
        request.fromTime = new Date(0);
        request.toTime = new Date();
    }

    const data = await supplyModel.select(request);
    return convertType(data);
};

const create = async (request: createRM): Promise<number> => {
    const data = await supplyModel.create(request);
    return data.id;
};

const updateById = async (request: updateRM): Promise<void> => {
    await supplyModel.updateById(request);
    return;
};

const deleteById = async (id: number): Promise<void> => {
    await supplyModel.deletById(id);
    return;
};

const selectById = async (id: number): Promise<Supply | null> => {
    return supplyModel.selectById(id);
};

const convertType = (data: Supply[]): SupplyRes[] => {
    const res = <SupplyRes[]>[];
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
