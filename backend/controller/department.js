import db from "../model/index.js";
import { hasPermission } from "../utils/permission.js";
const department = db.department;
const User = db.user;
const getOrganizationUserId = async (orgid) => {
  try {
    const organizationUser = await User.findOne({
      where: {
        organizationid: orgid,
      },
    });

    return organizationUser ? organizationUser.userid : "";
  } catch (error) {
    return "";
  }
};
export const registerDepartment = async (req, res, next) => {
  const { name, description, orgid, userid } = req.body;

  try {
    const realuserid =
      userid === "" ? await getOrganizationUserId(orgid) : userid;

    const isActiveUser = await User.findOne({
      where: {
        organizationid: orgid,
        accountactivated: true,
      },
    });

    if (!isActiveUser) {
      return res.status(403).send({
        message: "Only active users are allowed to add departments.",
      });
    }

    await department.create({
      organizationId: orgid,
      name,
      description,
      userid: realuserid,
    });

    return res.status(201).send({
      message: "Department added successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const editDepartment = async (req, res, next) => {
  let ownerspermission = req.user.roles.includes("product_owner");
  let corporatepermission = req.user.roles.includes("corporate_owner");
  const { name, description } = req.body;
  let { departmentid } = req.params;

  const isActiveUser = await User.findOne({
    where: {
      userid: req.user.orgid,
    },
  });
  if (isActiveUser?.accountactivated === false) {
    return res.status(403).send({
      message: "Only active users are allowed to add departments.",
    });
  }
  // Check if the department belongs to the user's organization
  const dept = await department.findOne({
    where: {
      organizationId: req.user.orgid,
      departmentid: departmentid,
    },
  });

  if ((!dept && !ownerspermission) || !corporatepermission) {
    return res.status(403).json({
      message: "permission denied",
    });
  }

  try {
    await department.update(
      {
        name,
        description,
      },
      { where: { departmentid } }
    );
    return res.status(201).send({
      message: "department updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deactivateDepartment = async (req, res, next) => {
  const { departmentid } = req.params;
  let ownerspermission = req.user.roles.includes("product_owner");

  try {
    // Check if the user is active
    const isActiveUser = await User.findOne({
      where: {
        organizationid: req.user.orgid,
        accountactivated: true,
      },
    });

    if (!isActiveUser) {
      return res.status(403).json({
        message: "Only active users are allowed to edit departments.",
      });
    }

    // Check if the department belongs to the user's organization
    const dept = await department.findOne({
      where: {
        organizationId: req.user.orgid,
        departmentid: departmentid,
      },
    });

    if (!dept && !ownerspermission) {
      return res.status(403).json({
        message:
          "You are only permitted to deactivate departments in your organization.",
      });
    }

    // Check if the user has permission to deactivate departments
    const isPermitted = hasPermission(req.user.roles);
    if (!isPermitted) {
      return res.status(403).json({
        message: "You do not have permission to deactivate departments.",
      });
    }

    // Update the department status to deactivated
    await department.update(
      {
        active: false,
      },
      { where: { departmentid: departmentid } }
    );

    return res.status(200).json({
      message: "Department deactivated successfully.",
    });
  } catch (error) {
    next(error);
    res.status(500).json({ message: "Error updating department." });
  }
};
export const activateDepartment = async (req, res, next) => {
  const { departmentid } = req.params;
  let ownerspermission = req.user.roles.includes("product_owner");

  try {
    // Check if the user is active
    const isActiveUser = await User.findOne({
      where: {
        organizationid: req.user.orgid,
        accountactivated: true,
      },
    });

    if (!isActiveUser) {
      return res.status(403).json({
        message: "Only active users are allowed to activate departments.",
      });
    }

    // Check if the department belongs to the user's organization
    const dept = await department.findOne({
      where: {
        organizationId: req.user.orgid,
        departmentid: departmentid,
      },
    });

    if (!dept && !ownerspermission) {
      return res.status(403).json({
        message:
          "You are only permitted to activate departments in your organization.",
      });
    }

    // Check if the user has permission to deactivate departments
    const isPermitted = hasPermission(req.user.roles);

    if (!isPermitted) {
      return res.status(403).json({
        message: "You do not have permission to activate departments.",
      });
    }

    // Update the department status to deactivated
    await department.update(
      {
        active: true,
      },
      { where: { departmentid: departmentid } }
    );

    return res.status(200).json({
      message: "Department activated successfully.",
    });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Error updating department." });
  }
};

// export const activateDepartment = async (req, res, next) => {
//   let { departmentid } = req.params;
//   const isActiveUser = await User.findOne({
//     where: {
//       userid: req.user.orgid,
//     },
//   });
//   if (isActiveUser?.accountactivated === false) {
//     return res.status(403).send({
//       message: "Only active users are allowed to add departments.",
//     });
//   }
//   try {
//     await department.update(
//       {
//         active: true,
//       },
//       { where: { departmentid } }
//     );
//     return res.status(200).send({
//       message: "department activated successfully",
//     });
//   } catch (error) {
//     next(error) ||
//       res.status(404).send({ message: "error updating department" });
//   }
// };

export const getOrganizationsDepartment = async (req, res, next) => {
  try {
    let ownersPermission = req.user.roles.includes("product_owner");
    let corporatePermission = req.user.roles.includes("corporate_owner");

    if (ownersPermission) {
      const departments = await department.findAll({
        attributes: [
          "name",
          "active",
          "createdAt",
          "description",
          "organizationid",
          "departmentid",
          "organizationid",
        ],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["companyname"],
          },
        ],
      });
      return res.status(200).send(departments);
    } else if (corporatePermission) {
      const departments = await department.findAll({
        where: {
          organizationid: req.user.orgid,
        },
        attributes: [
          "name",
          "active",
          "createdAt",
          "description",
          "departmentid",
        ],
      });
      return res.status(200).send(departments);
    } else {
      // If the user doesn't have the required permissions, throw a 403 error
      return res
        .status(403)
        .send({ message: "You are not permitted to view this resource" });
    }
  } catch (error) {
    next(error);
  }
};

export const getDepartments = async (req, res, next) => {
  let { orgid } = req.params;

  try {
    let departments = await department.findAll({
      where: {
        organizationid: orgid,
      },
    });
    return res.status(200).send(departments);
  } catch (error) {
    next(error);
  }
};

export const SearchOrgsDept = async (req, res, next) => {
  let { orgid } = req.params;
  try {
    const departments = await department.findAll({
      where: {
        organizationId: orgid,
        active: true,
      },
      attributes: ["name", "organizationid", "departmentid"],
    });
    return res.status(200).send(departments);
  } catch (error) {
    next(error);
  }
};
