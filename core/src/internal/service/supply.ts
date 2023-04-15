import { Supply } from "../../model/market.js";
import { createRM, getRM, updateRM } from "../../model/request.js";
import supplyModel from "../repository/sale.js";

interface ISupplyService {
    select: (request: getRM) => Promise<Supply[]>;
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

const select = async (request: getRM): Promise<Supply[]> => {
    return await supplyModel.select(request);
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

export default InitSupplyService();
