import express from "express";
import * as InboundController from "../../controllers/inbound.controller.js";

const router = express.Router();

router.get("/", InboundController.getInbounds);

export default router;
