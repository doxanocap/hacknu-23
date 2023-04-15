import express, { NextFunction, Request, Response } from "express";
import middlewares from "../middlewares/index.js";

export const sale = express.Router();

sale.get("", middlewares.cover())
sale.put("", middlewares.cover())
sale.delete("", middlewares.cover())
sale.post("", middlewares.cover())