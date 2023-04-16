import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import config from "./config/index.js";
import api from "./internal/handler/index.js";
import middlewares from "./internal/middlewares/index.js";

dotenv.config();

const app: Express = express();
const logger = morgan("combined");
const port = process.env.PORT || 8080;

app.use(logger);
app.use(cors(config.cors));
app.use(cookieParser());
app.use(express.json());

app.use("/api", api);
app.use(middlewares.errorHandler);

app.get("/", (req: Request, res: Response) => {
    res.status(200).json("OK");
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
