import express from "express";
import { auth } from "../../utils/verify.js";
import { getPendingPayment, getProfit } from "../../controller/payment.js";
const routes = express.Router({
  mergeParams: true,
});
routes.get("/getprofit", auth, getProfit);
routes.get("/getpendingprofit", auth, getPendingPayment);

export default routes;
