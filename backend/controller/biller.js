import db from "../model/index.js";
const Biller = db.biller;
const User = db.user;
const Department = db.department;

export const generateBill = async (req, res, next) => {
  const { billcode, billdescription, amount } = req.body;
  let { orgid, deptid, userid } = req.params;
  console.log(orgid, userid);

  const isActiveUser = await User.findOne({
    where: {
      organizationid: orgid,
      accountactivated: true,
      userid,
    },
  });
  console.log(isActiveUser);
  if (!isActiveUser) {
    return res.status(403).send({
      message: "Only active users are allowed to add departments.",
    });
  }
  try {
    await Biller.create({
      userid: userid,
      departmentid: deptid,
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
  let { orgid } = req.params;

  try {
    let billers = await Biller.findAll({
      where: { organizationid: orgid, active: true },
      include: [
        {
          model: Department,
          as: "department",
          attributes: ["name"],
        },
      ],
    });
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
