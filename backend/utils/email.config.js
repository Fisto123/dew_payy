import nodemailer from "nodemailer";
import randomstring from "randomstring";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "iwillmichofat@gmail.com",
    pass: "chfygbtazihukgrx",
  },
});

export const generateActivationCode = () => {
  return randomstring.generate({
    length: 16,
    charset: "alphanumeric",
  });
};
export const generateRandonPhone = () => {
  return randomstring.generate({
    length: 11,
    charset: "numeric",
  });
};
export const sendMail = (email, activationCode, task) => {
  const mailOptions = {
    from: "info@iWill.com",
    to: email,
    subject: "activation",
    text: `please procced to http://localhost:3001/${task}/${activationCode} to activate token" `,
  };
  return mailOptions;
};
