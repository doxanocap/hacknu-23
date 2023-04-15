export interface createRM {
    barcode: number;
    price: number;
    quantity: number;
    supplyTime: Date;
}

export interface updateRM {
    id: number;
    barcode: number;
    price: number;
    quantity: number;
    supplyTime: Date;
}

export interface getRM {
    fromTime: Date;
    toTime: Date;
    barcode: number;
}
