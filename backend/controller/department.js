import db from "../model/index.js";
import { hasPermission } from "../utils/permission.js";
const department = db.department;
const User = db.user;

export const registerDepartment = async (req, res, next) => {
  const { name, description } = req.body;
  console.log("res", req.user.orgid);
  const isActiveUser = await User.findOne({
    where: {
      organizationid: req.user.orgid,
      accountactivated: true,
    },
  });

  if (!isActiveUser) {
    return res.status(403).send({
      message: "Only active users are allowed to add departments.",
    });
  }
  try {
    await department.create({
      organizationId: req.user.orgid,
      name,
      description,
      userid: req.user.id,
    });
    return res.status(201).send({
      message: "department added successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const editDepartment = async (req, res, next) => {
  let ownerspermission = req.user.roles.includes("product_owner");
  let corporatepermission = req.user.roles.includes("corporate_owner");
  console.log(ownerspermission, corporatepermission);
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

  if (!dept) {
    return res.status(403).json({
      message:
        "You are only permitted to activate departments in your organization.",
    });
  }
  if (!ownerspermission && !corporatepermission) {
    return res.status(403).json({
      message: "you arent allowed to edit.",
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
        message: "Only active users are allowed to deactivate departments.",
      });
    }

    // Check if the department belongs to the user's organization
    const dept = await department.findOne({
      where: {
        organizationId: req.user.orgid,
        departmentid: departmentid,
      },
    });

    if (!dept) {
      return res.status(403).json({
        message:
          "You are only permitted to deactivate departments in your organization.",
      });
    }

    // Check if the user has permission to deactivate departments
    const isPermitted = hasPermission(isActiveUser.roles);

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
    console.error(error);
    next(error) ||
      res.status(500).json({ message: "Error updating department." });
  }
};
export const activateDepartment = async (req, res, next) => {
  const { departmentid } = req.params;

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

    if (!dept) {
      return res.status(403).json({
        message:
          "You are only permitted to activate departments in your organization.",
      });
    }

    // Check if the user has permission to deactivate departments
    const isPermitted = hasPermission(isActiveUser.roles);

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
    console.error(error);
    next(error) ||
      res.status(500).json({ message: "Error updating department." });
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
    let ownerspermission = req.user.roles.includes("product_owner");
    let corporatepermission = req.user.roles.includes("corporate_owner");

    let departments = ownerspermission
      ? await department.findAll({
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
        })
      : corporatepermission
      ? await department.findAll({
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
        })
      : { status: 403, message: "you are not permitted to view resource" };
    return res.status(200).send(departments);
  } catch (error) {
    next(error);
  }
};
export const getDepartments = async (req, res, next) => {
  let { orgid } = req.params;
  console.log(orgid);

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
