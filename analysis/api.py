from fastapi import FastAPI, Depends, BackgroundTasks
from datetime import datetime, timedelta
from analysis import data_analysis
from database import DATABASE_URL
import math
from scheduler import get_db
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from models import *
import os

app = FastAPI()


@app.get("/api/reports/")
def home(barcode: str, fromTime: str, toTime: str, db: Session = Depends(get_db)):
    fromTime = datetime.fromisoformat(fromTime)
    toTime = datetime.fromisoformat(toTime)
    interval = toTime - fromTime
    if interval >= timedelta(weeks=1):
        fr = math.ceil(fromTime.timestamp() / (60 * 60 * 24 * 7))
        to = math.floor(toTime.timestamp() / (60 * 60 * 24 * 7))
        from_timestamp = datetime.fromtimestamp(fr * 60 * 60 * 24 * 7)
        to_timestamp = datetime.fromtimestamp(to * 60 * 60 * 24 * 7)
        weeks = db.query(func.coalesce(func.sum(Archive.quantity), 0), func.coalesce(func.sum(Archive.revenue), 0), func.coalesce(func.sum(Archive.net_profit), 0)).where(
            and_(Archive.week_id >= fr, Archive.week_id <= to, Archive.barcode == barcode)).all()
        before_supply = db.query(func.coalesce(func.sum(Supply.quantity), 0),
                                 func.coalesce(func.sum(Supply.quantity * Supply.price), 0)).where(
            and_(Supply.time >= fromTime, Supply.time <= from_timestamp, Supply.barcode == barcode)).all()
        before_sale = db.query(func.coalesce(func.sum(Sale.quantity), 0),
                               func.coalesce(func.sum(Sale.quantity * Sale.price), 0)).where(
            and_(Sale.time >= fromTime, Sale.time <= from_timestamp, Sale.barcode == barcode)).all()
        after_supply = db.query(func.coalesce(func.sum(Supply.quantity), 0),
                                func.coalesce(func.sum(Supply.quantity * Supply.price), 0)).where(
            and_(Supply.time >= to_timestamp, Supply.time <= toTime, Supply.barcode == barcode)).all()
        after_sale = db.query(func.coalesce(func.sum(Sale.quantity), 0),
                              func.coalesce(func.sum(Sale.quantity * Sale.price), 0)).where(
            and_(Sale.time >= to_timestamp, Sale.time <= toTime, Sale.barcode == barcode)).all()
    else:
        weeks = [(0, 0, 0)]
        before_supply = db.query(func.coalesce(func.sum(Supply.quantity), 0), func.coalesce(func.sum(Supply.quantity * Supply.price), 0)).where(
        and_(Supply.time >= fromTime, Supply.time <= toTime, Supply.barcode == barcode)).all()
        before_sale = db.query(func.coalesce(func.sum(Sale.quantity), 0), func.coalesce(func.sum(Sale.quantity * Sale.price), 0)).where(
        and_(Sale.time >= fromTime, Sale.time <= toTime, Sale.barcode == barcode)).all()
        after_sale = [(0, 0)]
        after_supply = [(0, 0)]
    quantity = weeks[0][0]
    revenue = weeks[0][1]
    net_profit = weeks[0][2]
    sales = zip(before_sale, after_sale)
    supplies = zip(before_supply, after_supply)
    for i in sales:
        quantity += i[0][0] + i[1][0]
        revenue += i[0][1] + i[1][1]
        net_profit += i[0][1] + i[1][1]
    for i in supplies:
        net_profit -= (i[0][1] + i[1][1])
    return {"barcode": barcode,
            "quantity": quantity,
            "revenue": revenue,
            "net_profit": net_profit}


@app.get("/analysis/")
def analysis(background: BackgroundTasks):
    a, b, c = data_analysis(DATABASE_URL)
    background.add_task(os.remove, a)
    background.add_task(os.remove, b)
    background.add_task(os.remove, c)


@app.post("/make/")
def update_archive(db: Session = Depends(get_db)):
    now = datetime.utcnow().timestamp()
    now //= 60 * 60 * 24
    now //= 7
    barcodes = db.query(Margin).all()
    last_weeks = []
    for barcode in barcodes:
        try:
            last_weeks.append(
                db.query(Archive).where(Archive.barcode == barcode.barcode and Archive.week_id == max(
                    archive.week_id for archive in db.query(Archive))).all()[0]
            )
        except IndexError:
            last_weeks.append({})
    a = zip(barcodes, last_weeks)
    for i in a:
        try:
            quantity = i[0].quantity - i[1].quantity
            revenue = i[0].revenue - i[1].revenue
            net_profit = i[0].net_profit - i[1].net_profit
        except Exception:
            quantity = i[0].quantity
            revenue = i[0].revenue
            net_profit = i[0].net_profit
        archive = Archive(week_id=now, barcode=i[0].barcode, quantity=quantity, revenue=revenue, net_profit=net_profit)
        db.add(archive)
    db.flush()
    db.commit()
