import { Op } from "sequelize";
import db from "../model/index.js";
import { hasPermission } from "../utils/permission.js";
import { generateRandonPhone } from "../utils/email.config.js";

const User = db.user;
export const addUser = async (req, res, next) => {
  const activationCode = req.activationCode;
  const { firstname, surname, email, department, roles, orgid } = req.body;
  try {
    const user = email && (await User.findOne({ where: { email } }));
    const org =
      orgid && (await User.findOne({ where: { organizationid: orgid } }));

    if (user) {
      return res.status(409).json({ error: "User already exists" });
    } else {
      let randdigit = generateRandonPhone();

      if (hasPermission(req.user.roles)) {
        await User.create({
          firstname,
          surname,
          email,
          department,
          roles: roles,
          actcode: activationCode,
          organizationid: orgid,
          passwordchanged: false,
          verifiedorgstatus: true,
          password: "N/A",
          phonenumber: randdigit,
          companyname: org.companyname,
        });
        return res.status(201).send({
          message:
            "registration successful please check your email to activate your account",
        });
      } else {
        return res.status(404).send({
          message: "you dont have permission to create users",
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const addRoles = async (req, res) => {
  const { userid } = req.params;
  const user = await User.findOne({ where: { userid } });
  try {
    if (user) {
      const updatedRoles = [...user.role, "terminal_agent"];
      await User.update(
        { role: updatedRoles.join(",") }, // Convert array to string
        { where: { userid } }
      );

      // Assuming the update is successful, you can send a response here
      return res.status(200).json({ message: "Role added successfully" });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    // Handle the error appropriately
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getBillerManagers = async (req, res, next) => {
  let ownerspermission = req.user.roles.includes("product_owner");
  try {
    if (!hasPermission(req.user.roles)) {
      return res.status(403).json({ message: "permission denied" });
    }
    const billers = ownerspermission
      ? await User.findAll({
          where: {
            roles: {
              [Op.like]: ["%biller_agent%"],
            },
            accountactivated: true,
          },
          attributes: [
            "firstname",
            "surname",
            "email",
            "companyname",
            "department",
          ],
        })
      : await User.findAll({
          where: {
            organizationid: req.user.orgid,
            accountactivated: true,
            roles: {
              [Op.like]: ["%biller_agent%"],
            },
          },
          attributes: ["firstname", "surname", "email", "department"],
        });

    return res.status(200).json(billers);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getTerminalManagers = async (req, res, next) => {
  let ownerspermission = req.user.roles.includes("product_owner");
  try {
    if (!hasPermission(req.user.roles)) {
      return res.status(403).json({ message: "permission denied" });
    }
    const terminals = ownerspermission
      ? await User.findAll({
          where: {
            roles: {
              [Op.like]: ["%terminal_agent%"],
            },
            accountactivated: true,
          },
          attributes: [
            "firstname",
            "surname",
            "email",
            "companyname",
            "department",
          ],
        })
      : await User.findAll({
          where: {
            organizationid: req.user.orgid,
            accountactivated: true,
            roles: {
              [Op.like]: ["%terminal_agent%"],
            },
          },
          attributes: ["firstname", "surname", "email", "department"],
        });

    return res.status(200).json(terminals);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getOrgUsers = async (req, res, next) => {
  let ownerspermission = req.user.roles.includes("product_owner");
  let corporatepermission = req.user.roles.includes("corporate_owner");

  try {
    if (!corporatepermission && !ownerspermission) {
      return res.status(403).json({ message: "permission denied" });
    }

    const users = ownerspermission
      ? await User.findAll({})
      : corporatepermission
      ? await User.findAll({
          where: {
            organizationid: req.user.orgid,
          },
        })
      : null;

    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req, res, next) => {
  const { surname, firstname, email, roles, department } = req.body;

  let { userid } = req.params;

  const isActiveUser = await User.findOne({
    where: {
      userid: req.user.orgid,
    },
  });
  if (isActiveUser?.accountactivated === false) {
    return res.status(403).send({
      message: "Only active users are allowed to edit users.",
    });
  }

  if (!hasPermission(req.user.roles)) {
    return res.status(403).json({
      message: "permission denied",
    });
  }

  try {
    await User.update(
      {
        surname,
        firstname,
        email,
        roles,
        department,
      },
      { where: { userid } }
    );
    return res.status(201).send({
      message: "user updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
