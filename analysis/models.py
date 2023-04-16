from sqlalchemy.orm import Mapped, mapped_column,declarative_base
from sqlalchemy import Column, TIMESTAMP, Index

Base = declarative_base()

class Archive(Base):
    __tablename__ = "archive"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    week_id: Mapped[int]
    barcode: Mapped[int]
    quantity: Mapped[int]
    revenue: Mapped[int]
    net_profit: Mapped[int]


class Margin(Base):
    __tablename__ = "margin"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    barcode: Mapped[int]
    quantity: Mapped[int]
    revenue: Mapped[int]
    net_profit: Mapped[int]

class Supply(Base):
    __tablename__ = "supply"

    id: Mapped[int] = mapped_column(primary_key=True,autoincrement=True)
    barcode: Mapped[int]
    quantity: Mapped[int]
    price: Mapped[int]
    time = Column("time", TIMESTAMP)


class Sale(Base):
    __tablename__ = "sale"

    id: Mapped[int] = mapped_column(primary_key=True,autoincrement=True)
    barcode: Mapped[int]
    quantity: Mapped[int]
    price: Mapped[int]
    time = Column("time", TIMESTAMP)

Index("myindex", Archive.week_id)
