import express from "express";
import {
  activateBiller,
  deactivateBiller,
  editBiller,
  generateBill,
  getBillCode,
  getOrganizationsBiller,
} from "../../controller/biller.js";
import { auth } from "../../utils/verify.js";

const routes = express.Router({
  mergeParams: true,
});

routes.post("/generatebill", auth, generateBill);
routes.get("/getOrganizationBiller", auth, getOrganizationsBiller);
routes.patch("/deactivatebiller/:billerid", deactivateBiller);
routes.patch("/activatebiller/:billerid", activateBiller);
routes.get("/getbill/:orgid/:billcode", getBillCode);

routes.patch("/editbill/:billerid", auth, editBiller);
export default routes;
