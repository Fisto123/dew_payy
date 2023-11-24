import express from "express";
import {
  deactivateBiller,
  generateBill,
  getOrganizationsBiller,
} from "../../controller/biller.js";

const routes = express.Router({
  mergeParams: true,
});

routes.post("/generatebill/:deptid/:orgid/:userid", generateBill);
routes.get("/getOrganizationBiller/:orgid", getOrganizationsBiller);
routes.patch("/deactivatebiller/:billerid", deactivateBiller);

export default routes;
