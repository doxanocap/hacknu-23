from rocketry import Rocketry
from rocketry.conds import weekly
from models import *
from sqlalchemy.orm import Session
from database import SessionLocal
from fastapi import Depends
from datetime import datetime


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = Rocketry()


@app.task(weekly.at("Thu"))
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
