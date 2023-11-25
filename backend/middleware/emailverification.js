import { Op } from "sequelize";
import db from "../model/index.js";
import {
  generateActivationCode,
  sendMail,
  transporter,
} from "../utils/email.config.js";
const User = db.user;

const sendActivationEmail = (email, task) => {
  const activationCode = generateActivationCode();
  transporter.sendMail(sendMail(email, activationCode, task), (error, info) => {
    if (error) {
      return error;
    } else {
      console.log("Activation email sent:", info.response);
    }
  });
  return activationCode;
};
export const emailVerificationMiddlewareAdmin = async (req, res, next) => {
  const { email, phonenumber } = req.body;
  try {
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ phonenumber }, { email }],
      },
    });
    if (existingUser) {
      return res.status(409).json({ error: "phone or email already exists" });
    } else {
      req.activationCode = sendActivationEmail(email, "login");
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const emailVerificationMiddlewareUserAdmin = async (req, res, next) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });
    if (existingUser) {
      return res.status(409).json({ error: "phone or email already exists" });
    } else {
      req.activationCode = sendActivationEmail(email, "resetpassword");
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};
