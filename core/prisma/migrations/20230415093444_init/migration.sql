-- CreateTable
CREATE TABLE "Margin" (
    "id" SERIAL NOT NULL,
    "barcode" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "revenue" INTEGER NOT NULL,
    "net_profit" INTEGER NOT NULL,

    CONSTRAINT "Margin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supply" (
    "id" SERIAL NOT NULL,
    "barcode" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" SERIAL NOT NULL,
    "barcode" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Margin_barcode_idx" ON "Margin"("barcode");

-- CreateIndex
CREATE INDEX "Supply_barcode_time_idx" ON "Supply"("barcode", "time");

-- CreateIndex
CREATE INDEX "Sale_barcode_time_idx" ON "Sale"("barcode", "time");
