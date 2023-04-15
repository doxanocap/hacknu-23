import { Sale as SaleModel, Supply as SupplyModel, Margin as MarginModel } from "@prisma/client";

export interface Sale extends SaleModel {}
export interface Supply extends SupplyModel {}
export interface Margin extends MarginModel {}