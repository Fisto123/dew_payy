import express from "express";
import {
  activateDepartment,
  deactivateDepartment,
  editDepartment,
  getDepartments,
  getOrganizationsDepartment,
  registerDepartment,
} from "../../controller/department.js";
import { auth } from "../../utils/verify.js";
const routes = express.Router({
  mergeParams: true,
});

routes.post("/registerdepartment", auth, registerDepartment);
routes.patch("/editdepartment/:departmentid", auth, editDepartment);
routes.patch("/deactivateDepartment/:departmentid", auth, deactivateDepartment);
routes.patch("/activateDepartment/:departmentid", auth, activateDepartment);
routes.get("/getDepartments", auth, getDepartments);
routes.get("/getOrgDepartments", auth, getOrganizationsDepartment);

export default routes;
