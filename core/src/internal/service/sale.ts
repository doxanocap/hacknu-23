import { Sale, SaleRes } from "../../model/market.js";
import { createRM, getRM, updateRM } from "../../model/request.js";
import saleModel from "../repository/sale.js";
interface ISaleService {
    select: (request: getRM) => Promise<SaleRes[]>;
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

const select = async (request: getRM): Promise<SaleRes[]> => {
    if (
        request.fromTime.toString() === "" &&
        request.toTime.toString() === ""
    ) {
        request.fromTime = new Date(0);
        request.toTime = new Date();
    }

    const data = await saleModel.select(request);
    return convertType(data);
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

const convertType = (data: Sale[]): SaleRes[] => {
    const res = <SaleRes[]>[];
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
