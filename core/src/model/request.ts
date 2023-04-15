export interface createRM {
    barcode: number;
    price: number;
    quantity: number;
    time: Date;
}

export interface updateRM {
    id: number;
    barcode: number;
    price: number;
    quantity: number;
    time: Date;
}

export interface getRM {
    fromTime: Date;
    toTime: Date;
    barcode: number;
}
