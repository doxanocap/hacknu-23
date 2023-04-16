export interface createRM {
    barcode: bigint;
    price: number;
    quantity: number;
    time: Date;
}

export interface updateRM {
    id: number;
    barcode: bigint;
    price: number;
    quantity: number;
    time: Date;
}

export interface getRM {
    fromTime: Date;
    toTime: Date;
    barcode: bigint;
}

export interface updateMargin {
    barcode: bigint,
    net_profit: number;
    revenue: number;
    quantity: number;
}