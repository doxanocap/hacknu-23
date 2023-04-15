import express from "express";
import { sale } from "./sale.js";
import { supply } from "./supply.js";

const api = express.Router();

api.use("/supplies", supply);
api.use("/sale", sale);

export default api;
