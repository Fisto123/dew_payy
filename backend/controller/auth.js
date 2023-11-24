import db from "../model/index.js";
const User = db.user;
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

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
  console.log(actcode);
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

export const updateCorporateIdentity = async (req, res, next) => {
  const { RCNo, CAC, utility } = req.body;
  console.log(RCNo, CAC, utility);
  const { organizationid } = req.params;

  try {
    let update = await User.update(
      {
        corporatedocumentinfo: {
          RCNo,
          CAC,
          utility,
        },
      },
      { where: { organizationid } }
    );
    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateCorporateInformation = async (req, res, next) => {
  const { companyname, address1, address2, city, zipcode, state } = req.body;
  const { organizationid } = req.params;

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
      },
      { where: { organizationid } }
    );
    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const updatecorporatecontact = async (req, res, next) => {
  const { phone, email, fullname, idcard } = req.body;
  const { organizationid } = req.params;

  try {
    let update = await User.update(
      {
        corporatecontact: {
          phone,
          email,
          fullname,
          idcard,
        },
      },
      { where: { organizationid } }
    );
    return res.status(200).json({ message: "updated successfully" });
  } catch (error) {
    next(error);
  }
};
