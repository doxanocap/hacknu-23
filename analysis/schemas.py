from pydantic import BaseModel


class Report(BaseModel):
    barcode: int
    fromTime: str
    toTime: str


class ReportResponse(BaseModel):
    barcode: int
    quantity: int
    revenue: int
    net_profit: int
