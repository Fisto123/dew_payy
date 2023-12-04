import db from "../model/index.js";
import { hasPermission } from "../utils/permission.js";
const Biller = db.biller;
const User = db.user;
const Department = db.department;

export const generateBill = async (req, res, next) => {
  const { billcode, billdescription, amount, orgid, departmentid } = req.body;
  const isPermitted = hasPermission(req.user.roles);
  const isActiveUser = await User.findOne({
    where: {
      organizationid: req.user.orgid,
      accountactivated: true,
    },
  });
  const isbillerUnique = await Biller.findOne({
    where: {
      billcode,
      organizationid: orgid,
    },
  });
  if (isbillerUnique) {
    return res.status(404).send({
      message: "bill code already exists",
    });
  } else if (!isActiveUser) {
    return res.status(404).send({
      message: "Only active users are allowed to add departments.",
    });
  } else if (!isPermitted) {
    return res.status(403).send({
      message: "you are not permitted",
    });
  }
  try {
    await Biller.create({
      userid: req.user.id,
      departmentid,
      organizationid: orgid,
      billcode,
      billdescription,
      amount,
      status: true,
    });
    return res.status(201).send({
      message: "biller generated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationsBiller = async (req, res, next) => {
  const permissions = hasPermission(req.user.roles);
  let productOwner = req.user.roles.includes("product_owner");

  if (!permissions) {
    return res.status(403).send({
      message: "You are not permitted",
    });
  }

  try {
    let billers = productOwner
      ? await Biller.findAll({
          include: [
            {
              model: Department,
              as: "department",
              attributes: ["name", "departmentid"],
            },
          ],
        })
      : await Biller.findAll({
          where: { organizationid: req.user.orgid },
          include: [
            {
              model: Department,
              as: "department",
              attributes: ["name", "departmentid"],
            },
          ],
        });

    // Use Promise.all to execute asynchronous queries concurrently
    billers = await Promise.all(
      billers.map(async (biller) => {
        // Find details of the associated organization for each biller
        let organization = null;

        // Check the user's role to determine whether to include organization details
        if (productOwner) {
          organization = await User.findOne({
            where: { organizationid: biller.organizationid },
            attributes: ["companyname"], // Add the attributes you want to retrieve
          });
        }

        // Append organization details to the biller object
        return {
          ...biller.toJSON(), // Convert Sequelize instance to a plain object
          organization,
        };
      })
    );

    return res.status(200).send(billers);
  } catch (error) {
    next(error);
  }
};

export const deactivateBiller = async (req, res, next) => {
  let { billerid } = req.params;
  try {
    await Biller.update(
      {
        active: false,
      },
      { where: { billerid } }
    );
    return res.status(200).send({
      message: "biller deactivated successfully",
    });
  } catch (error) {
    next(error);
  }
};
export const activateBiller = async (req, res, next) => {
  let { billerid } = req.params;

  try {
    await Biller.update(
      {
        active: true,
      },
      { where: { billerid } }
    );
    return res.status(200).send({
      message: "biller activated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const editBiller = async (req, res, next) => {
  let ownerspermission = req.user.roles.includes("product_owner");
  let corporatepermission = req.user.roles.includes("corporate_owner");
  const { name, billdescription, billcode, amount } = req.body;
  let { billerid } = req.params;
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
  // Check if the biller belongs to the user's organization
  const bill = await Biller.findOne({
    where: {
      organizationId: req.user.orgid,
      billerid,
    },
  });

  if ((!bill && !ownerspermission) || !corporatepermission) {
    return res.status(403).json({
      message: "permission denied",
    });
  }

  try {
    await Biller.update(
      {
        name,
        billdescription,
        billcode,
        amount,
      },
      { where: { billerid } }
    );
    return res.status(201).send({
      message: "biller updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getBillCode = async (req, res) => {
  let { orgid, billcode } = req.params;
  try {
    let bill = await Biller.findOne({
      where: { billcode, organizationid: orgid },
      attributes: ["billerid", "amount"],
    });
    return res.status(200).send(bill);
  } catch (error) {}
};
