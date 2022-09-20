import express from "express";
import "express-async-errors";
import cors from "cors";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import recommendationRouter from "./routers/recommendationRouter";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/recommendations", recommendationRouter);
app.use(errorHandlerMiddleware);

export default app;
