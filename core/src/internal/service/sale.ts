import { Sale } from "../../model/market.js";
import { createRM, getRM, updateRM } from "../../model/request.js";
import saleModel from "../repository/sale.js";
interface ISaleService {
    select: (request: getRM) => Promise<Sale[]>;
    create: (request: createRM) => Promise<number>;
    updateById: (request: updateRM) => Promise<void>;
    deleteById: (id: number) => Promise<void>;
    selectById: (id: number) => Promise<Sale | null>;
}

const InitSaleService = (): ISaleService => {
    return {
        select: select,
        create: create,
        updateById: updateById,
        deleteById: deleteById,
        selectById: selectById,
    };
};

const select = async (request: getRM): Promise<Sale[]> => {
    return await saleModel.select(request);
};

const create = async (request: createRM): Promise<number> => {
    const data = await saleModel.create(request);
    return data.id;
};

const updateById = async (request: updateRM): Promise<void> => {
    await saleModel.updateById(request);
    return;
};

const deleteById = async (id: number): Promise<void> => {
    await saleModel.deletById(id);
    return;
};

const selectById = async (id: number): Promise<Sale | null> => {
    return saleModel.selectById(id);
};

export default InitSaleService();
