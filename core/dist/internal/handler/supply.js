import express from "express";
import supplyController from "../controller/supply.js";
import middlewares from "../middlewares/index.js";
export const supply = express.Router();
supply.get("", middlewares.cover(supplyController.getByParams));
supply.post("", middlewares.cover(supplyController.recordByParams));
supply.put("/:id", middlewares.cover(supplyController.updateById));
supply.delete("/:id", middlewares.cover(supplyController.deleteById));
supply.get("/:id", middlewares.cover(supplyController.getById));
//# sourceMappingURL=supply.js.map