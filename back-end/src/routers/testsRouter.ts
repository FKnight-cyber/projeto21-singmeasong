import { Router } from "express";
import { clearRecs, populateRecs } from "../controllers/testController";

const testRouter = Router();

testRouter.delete("/testes/clear",clearRecs);
testRouter.post("/testes/populate",populateRecs);

export default testRouter;