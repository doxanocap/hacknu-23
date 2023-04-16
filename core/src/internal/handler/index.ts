import express from "express";
import { sale } from "./sale.js";
import { supply } from "./supply.js";

const api = express.Router();
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

api.use("/supplies", supply);
api.use("/sale", sale);

// api.get("/insert", async (req: Request, res: Response, next: NextFunction) => {
//     const file = fs.readFileSync("insert_sale.txt", "utf8");
//     const lines = file.split("\n");

//     let query =
//         "insert into supply (id, barcode, quantity, price, time) values ";

//     let q2 = [];
//     await (async () => {
//         for (let i = 0; i < lines.length; i++) {
//             if (i % 1000 === 0 && i !== 0) {
//                 console.log(q2.join(""));

//                 res.status(200);
//                 return;
//                 lines[i] = lines[i].substring(0, lines[i].length - 1);
//                 lines[i] += ";";

//                 await prisma.$executeRaw`${query}`;
//                 await sleep(10000);
//             }
//             q2.push(lines[i]);
//             console.log(q2);

//             await sleep(1);
//         }
//     })();

//     res.status(200).send();
// });

export default api;
