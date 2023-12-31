import db, { sequelize } from "../model/index.js";
const User = db.user;
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { hasPermission } from "../utils/permission.js";

export const registerCorporate = async (req, res, next) => {
  const activationCode = req.activationCode;
  const { firstname, surname, email, password, companyname, phonenumber } =
    req.body;
  try {
    const user = email && (await User.findOne({ where: { email } }));
    if (user) {
      return res.status(409).json({ error: "User already exists" });
    } else {
      const saltRounds = 10;
      const passwordHash =
        password && (await bcrypt.hash(password, saltRounds));
      await User.create({
        firstname,
        surname,
        email,
        companyname,
        password: passwordHash,
        phonenumber,
        actcode: activationCode,
        passwordchanged: true,
        roles: ["corporate_owner"],
      });
      return res.status(201).send({
        message:
          "registration successful please check your email to activate your account",
      });
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  let user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!email || !password) {
    return res
      .status(404)
      .send({ message: "email or password field is required" });
  }
  try {
    if (!user) {
      return res
        .status(404)
        .send({ message: "username or password not correct" });
    }
    const ispasswordCorrect =
      password && (await bcrypt.compare(password, user.password));
    if (!ispasswordCorrect) {
      return res.status(404).send({ message: "password not correct" });
    }
    if (!user) {
      return res.status(404).send({ message: "username/password not correct" });
    }
    if (user.accountactivated === false) {
      return res.status(404).send({
        message: "please go to your email and activate your account",
      });
    } else {
      const token = generateToken(user);
      res.setHeader("Authorization", `Bearer ${token}`);
      return res.status(200).send({ token });
    }
  } catch (error) {
    next(error);
  }
};
export const resetPassword = async (req, res, next) => {
  const { password, actcode } = req.body;
  let user = await User.findOne({
    where: {
      actcode: actcode,
    },
  });

  try {
    if (!user) {
      return res.status(404).send({ message: "activation code deosnt exist" });
    } else {
      const saltRounds = 10;
      const passwordHash =
        password && (await bcrypt.hash(password, saltRounds));
      await User.update(
        {
          password: passwordHash,
          passwordchanged: true,
          accountactivated: true,
        },
        { where: { userid: user.userid } }
      );
      return res
        .status(200)
        .send({ message: "password reset successful, please login" });
    }
  } catch (error) {
    next(error);
  }
};
export const activateUser = async (req, res, next) => {
  let { actcode } = req.params;
  try {
    const doesCodeExist = await User.findOne({ where: { actcode } });
    if (!doesCodeExist) {
      return res.status(404).send({ message: "activation failed" });
    } else {
      if (doesCodeExist?.accountactivated) {
        return res.status(404).send({
          message: "account has already been activated, please login",
        });
      }
      await User.update(
        { accountactivated: true },
        { where: { email: doesCodeExist.email } }
      );
      return res
        .status(200)
        .send({ message: "account activated successfully, please login" });
    }
  } catch (error) {
    next(error);
  }
};

// export const updateCorporateIdentity = async (req, res, next) => {
//   console.log(req.file.path);
//   const { RCNo, CAC, utility, status } = req.body;
//   console.log(RCNo, CAC, utility);

//   let { orgid } = req.params;

//   try {
//     await User.update(
//       {
//         corporatedocumentinfo: {
//           RCNo,
//           CAC,
//           utility,
//         },
//         corporatedocumentinfostatus: status,
//       },
//       { where: { organizationid: orgid } }
//     );
//     return res.status(200).json({ message: "updated successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

export const updateCorporateIdentity = async (req, res, next) => {
  try {
    // Use a Promise to properly await the completion of the upload middleware
    await new Promise((resolve, reject) => {
      upload(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    // Access uploaded files
    const CACImage = req.files.cac && req.files.cac[0]?.filename;
    const utilityImage = req.files.utility && req.files.utility[0]?.filename;
    console.log(req.files.utility[0]?.filename, req.files.cac[0]?.filename);
    // Access other data from the request
    const { orgid } = req.params;
    const { RCNo, status } = req.body;

    const user = await User.findOne({
      where: {
        organizationid: orgid,
      },
    });
    console.log("stat", status);

    console.log("corporateidentitystatus:", user.corporateidentitystatus);
    console.log("corporatecontactstatus:", user.corporatecontactstatus);
    const isVerifiedOrgStatus =
      status === "approved" &&
      user.corporateidentitystatus === "approved" &&
      user.corporatecontactstatus === "approved";

    console.log("isVerifiedOrgStatus:", isVerifiedOrgStatus);

    await User.update(
      {
        corporatedocumentinfo: {
          RCNo,
          utility: utilityImage,
          CAC: CACImage,
        },
        corporatedocumentinfostatus: status,
        verifiedorgstatus: isVerifiedOrgStatus,
      },
      { where: { organizationid: orgid } }
    );

    return res.status(200).json({ message: "Updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    next(error);
  }
};

export const updateCorporateInformation = async (req, res, next) => {
  const { companyname, address1, address2, city, zipcode, state, status } =
    req.body;

  let { orgid } = req.params;

  let ownerspermission = req.user.roles.includes("product_owner");

  const user = await User.findOne({
    where: {
      organizationid: orgid,
    },
  });
  const isVerifiedOrgStatus =
    status === "approved" &&
    user.corporatedocumentinfostatus === "approved" &&
    user.corporatecontactstatus === "approved";
  console.log("corporateidentitystatus:", user.corporateidentitystatus);
  console.log("corporatecontactstatus:", user.corporatecontactstatus);
  console.log("isVerifiedOrgStatus:", isVerifiedOrgStatus);
  try {
    let update = await User.update(
      {
        corporateinformation: {
          companyname,
          address1,
          address2,
          city,
          zipcode,
          state,
        },
        corporateidentitystatus: status,
        verifiedorgstatus: isVerifiedOrgStatus,
      },
      { where: { organizationid: orgid } }
    );
    return res
      .status(200)
      .json({ message: "corporate information updated successfully" });
  } catch (error) {
    next(error);
  }
};
export const changeCorporateInformationstatus = async (req, res, next) => {
  let { orgid } = req.params;
  let { status } = req.body;
  console.log(status);
  try {
    let update = await User.update(
      {
        corporateidentitystatus: status,
      },
      { where: { organizationid: orgid } }
    );
    return res
      .status(200)
      .json({ message: "corporate information updated successfully" });
  } catch (error) {
    next(error);
  }
};
export const updatecorporatecontact = async (req, res, next) => {
  const { forms, status } = req.body;
  let { orgid } = req.params;

  const user = await User.findOne({
    where: {
      organizationid: orgid,
    },
  });
  // console.log(
  //   user.corporateidentitystatus,
  //   ownerspermission,
  //   user.corporatedocumentinfostatus
  // );
  const formArray = forms?.map((data) => ({
    phone: data?.phone,
    email: data?.email,
    name: data?.name,
    address: data?.address,
  }));
  const isVerifiedOrgStatus =
    status === "approved" &&
    user.corporateidentitystatus === "approved" &&
    user.corporatedocumentinfostatus === "approved";

  try {
    await User.update(
      {
        corporatecontact: formArray,
        corporatecontactstatus: status,
        verifiedorgstatus: isVerifiedOrgStatus,
      },
      { where: { organizationid: orgid } }
    );

    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    next(error);
  }
};
export const getCorporates = async (req, res) => {
  if (hasPermission(req.user.roles)) {
    let corporates = await User.findAll({
      attributes: [
        [
          sequelize.fn("DISTINCT", sequelize.col("organizationid")),
          "organizationid",
        ],
        "companyname",
      ],
      where: {
        verifiedorgstatus: true,
        accountactivated: true,
      },
      raw: true,
    });
    res.status(200).send(corporates);
  } else {
    //res.status(403).send({ message: "permission denied" });
  }
};

export const deactivateUser = async (req, res, next) => {
  const { userid } = req.params;
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
        message: "Only active users are allowed to deactivate users",
      });
    }

    // Check if the department belongs to the user's organization
    const userz = await User.findOne({
      where: {
        organizationId: req.user.orgid,
        userid: userid,
      },
    });

    if (!userz && !ownerspermission) {
      return res.status(403).json({
        message:
          "You are only permitted to deactivate users within your organization.",
      });
    }

    // Check if the user has permission to deactivate departments
    const isPermitted = hasPermission(req.user.roles);

    if (!isPermitted) {
      return res.status(403).json({
        message: "You do not have permission to deactivate users.",
      });
    }

    // Update the department status to deactivated
    await User.update(
      {
        status: "inactive", // Check if 'active' is a correct value
      },
      { where: { userid: userid } }
    );

    return res.status(200).json({
      message: "user deactivated successfully.",
    });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Error updating users." });
  }
};

export const activateUserRole = async (req, res, next) => {
  const { userid } = req.params;
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
    const userz = await User.findOne({
      where: {
        organizationId: req.user.orgid,
        userid: userid,
      },
    });

    if (!userz && !ownerspermission) {
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
    await User.update(
      {
        status: "active",
      },
      { where: { userid: userid } }
    );

    return res.status(200).json({
      message: "user activated successfully.",
    });
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Error updating users." });
  }
};

export const getUserById = async (req, res) => {
  let { orgid } = req.params;
  try {
    const user = await User.findOne({
      where: { organizationid: orgid },
    });

    return res.status(200).json(user);
  } catch (error) {}
};
