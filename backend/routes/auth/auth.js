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
import multer from "multer";
import path from "path";
import db, { sequelize } from "../../model/index.js";
const User = db.user;
const routes = express.Router({
  mergeParams: true,
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Make sure the destination folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ["jpeg", "jpg", "png", "gif"];
    const extname = path.extname(file.originalname).toLowerCase().substring(1);

    if (allowedExtensions.includes(extname)) {
      return cb(null, true);
    }

    cb("Invalid file type. Allowed types: jpeg, jpg, png, gif");
  },
}).fields([{ name: "cac" }, { name: "utility" }]);

routes.patch(
  "/updateCorporateIdentity/:orgid",
  auth,
  async (req, res, next) => {
    try {
      await new Promise((resolve, reject) => {
        upload(req, res, (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });

      const CACImage = req.files.cac && req.files.cac[0]?.filename;
      const utilityImage = req.files.utility && req.files.utility[0]?.filename;
      const { orgid } = req.params;
      const { RCNo, status } = req.body;

      // Check if the record exists
      const existingUser = await User.findOne({
        where: { organizationid: orgid },
      });

      if (existingUser) {
        // Append base URL to filenames
        const baseURL =
          "file:///Users/fisto/Desktop/dewpay/dew_payy/backend/public/images/";
        const fullUtilityPath = utilityImage
          ? baseURL + utilityImage
          : existingUser?.corporatedocumentinfo?.utility;
        const fullCACPath = CACImage
          ? baseURL + CACImage
          : existingUser?.corporatedocumentinfo?.CAC;

        const updateFields = {
          corporatedocumentinfo: {
            RCNo,
            utility: fullUtilityPath,
            CAC: fullCACPath,
          },
          corporatedocumentinfostatus: status,
        };

        await User.update(updateFields, {
          where: { organizationid: orgid },
        });

        return res.status(200).json({ message: "Updated successfully" });
      } else {
        return res.status(404).json({ message: "Record not found" });
      }
    } catch (error) {
      console.error("Error:", error);
      next(error);
    }
  }
);

routes.post(
  "/registercorporate",
  emailVerificationMiddlewareAdmin,
  registerCorporate
);
routes.patch("/activateuser/:actcode", activateUser);
routes.post("/login", loginUser);

routes.patch(
  "/updateCorporateInformation/:orgid",
  auth,
  updateCorporateInformation
);
routes.patch("/updatecorporatecontact/:orgid", updatecorporatecontact);

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
