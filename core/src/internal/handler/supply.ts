import express from "express";
import supplyController from "../controller/supply.js";
import middlewares from "../middlewares/index.js";


export const supply = express.Router();

supply.get("", middlewares.cover(supplyController.getByParams));

supply.post("", middlewares.cover(supplyController.recordByParams));

supply.put("", middlewares.cover(supplyController.updateById));

supply.delete("", middlewares.cover(supplyController.deleteById));

supply.get("", middlewares.cover(supplyController.getById));
