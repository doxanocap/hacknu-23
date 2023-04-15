import dotenv from "dotenv";
import express from "express";
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server");
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map