import {
    margin as MarginModel,
    sale as SaleModel,
    supply as SupplyModel,
} from "@prisma/client";

export interface Sale extends SaleModel {}
export interface Supply extends SupplyModel {}
export interface Margin extends MarginModel {}

export interface SupplyRes {
    id: number;
    barcode: BigInt;
    quantity: number;
    price: number;
    time: Date;
}

export interface SaleRes extends SupplyRes {}
