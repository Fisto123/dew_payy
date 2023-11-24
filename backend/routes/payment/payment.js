import express from "express";
import {
  makeFullPayment,
  makePartialPayment,
} from "../../controller/payment.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/makefullpayment/:invoiceid", makeFullPayment);
routes.post("/makepartpayment/:invoiceid", makePartialPayment);

export default routes;
