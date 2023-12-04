import express from "express";
import {
  generateInvoice,
  getAllInvoices,
  getInvoice1,
  //getInvoice,
  //getSingleInvoice,
  payInvoice,
  paypartialInvoice,
} from "../../controller/invoice.js";
import { auth } from "../../utils/verify.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/generateinvoice", auth, generateInvoice);
routes.get("/getInvoice/:invoiceid", auth, getInvoice1);
routes.get("/getInvoices", auth, getAllInvoices);

//routes.get("/getSingle/:invoiceid", getSingleInvoice);
routes.put("/payfullinvoice/:invoiceid", auth, payInvoice);
routes.put("/paypartialInvoice/:invoiceid", auth, paypartialInvoice);

export default routes;
