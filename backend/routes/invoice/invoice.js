import express from "express";
import {
  generateInvoice,
  getInvoice,
  payInvoice,
  paypartialInvoice,
} from "../../controller/invoice.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/generateinvoice/:orgid", generateInvoice);
routes.get("/getInvoice/:orgid", getInvoice);
routes.put("/payfullinvoice/:invoiceid", payInvoice);
routes.put("/paypartialInvoice/:invoiceid", paypartialInvoice);

export default routes;
