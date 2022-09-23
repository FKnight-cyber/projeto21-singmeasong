import express from "express";
import "express-async-errors";
import cors from "cors";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import recommendationRouter from "./routers/recommendationRouter";
import testRouter from "./routers/testsRouter";
import dotenv from "dotenv";

dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());
app.use("/recommendations", recommendationRouter);
if(process.env.NODE_ENV === "test"){
    app.use("/recommendations", testRouter);
};
app.use(errorHandlerMiddleware);

export default app;
