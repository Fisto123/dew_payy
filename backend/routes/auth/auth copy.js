import express from "express";
import {
  activateUser,
  activateUserRole,
  deactivateUser,
  getCorporates,
  getUserById,
  loginUser,
  registerCorporate,
  resetPassword,
  updateCorporateIdentity,
  updateCorporateInformation,
  updatecorporatecontact,
} from "../../controller/auth.js";
import {
  emailVerificationMiddlewareAdmin,
  emailVerificationMiddlewareUserAdmin,
} from "../../middleware/emailverification.js";
import {
  addRoles,
  addUser,
  editUser,
  getAllUsers,
  getBillerManagers,
  getOrgUsers,
  getTerminalManagers,
} from "../../controller/user.js";
import { auth } from "../../utils/verify.js";
const routes = express.Router({
  mergeParams: true,
});
routes.patch(
  "/updateCorporateInformation/:orgid",
  auth,
  updateCorporateInformation
);
routes.post(
  "/registercorporate",
  emailVerificationMiddlewareAdmin,
  registerCorporate
);
routes.patch("/activateuser/:actcode", activateUser);
routes.post("/login", loginUser);
routes.patch("/updateCorporateIdentity/:orgid", auth, updateCorporateIdentity);
routes.patch(
  "/updateCorporateInformation/:orgid",
  auth,
  updateCorporateInformation
);
routes.patch("/updatecorporatecontact/:organizationid", updatecorporatecontact);

//USER
routes.post("/adduser", emailVerificationMiddlewareUserAdmin, auth, addUser);
routes.patch("/resetpassword", resetPassword);
routes.patch("/addroles/:userid", addRoles);
routes.get("/getBillerMangers", auth, getBillerManagers);
routes.get("/getterminalmanagers", auth, getTerminalManagers);
routes.get("/getorgusers", auth, getOrgUsers);
routes.get("/getuser/:orgid", auth, getUserById);
routes.get("/getcorporates", auth, getCorporates);
routes.patch("/deactivateuserstatus/:userid", auth, deactivateUser);
routes.patch("/activateuserstatus/:userid", auth, activateUserRole);
routes.patch("/edituser/:userid", auth, editUser);
routes.get("/getUsers", auth, getAllUsers);

export default routes;
