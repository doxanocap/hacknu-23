import express from "express";
import saleController from "../controller/sale.js";
import middlewares from "../middlewares/index.js";
export const sale = express.Router();
sale.get("", middlewares.cover(saleController.getByParams));
sale.post("", middlewares.cover(saleController.recordByParams));
sale.put("/:id", middlewares.cover(saleController.updateById));
sale.delete("/:id", middlewares.cover(saleController.deleteById));
sale.get("/:id", middlewares.cover(saleController.getById));
//# sourceMappingURL=sale.js.map