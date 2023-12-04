import { Op, Sequelize } from "sequelize";
import db, { sequelize } from "../model/index.js";

const Invoice = db.invoice;
const Payment = db.payment;

export const getProfit = async (req, res) => {
  try {
    const sumResult = await Payment.sum("amount", {
      where: {
        organizationid: req.user.orgid,
      },
    });

    res.status(200).json({ profit: sumResult });
  } catch (error) {
    console.error("Error calculating profit:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPendingPayment = async (req, res) => {
  try {
    const sumResult = await Invoice.sum("amountdue", {
      where: {
        organizationid: req.user.orgid,
        status: "pending",
      },
    });

    console.log("pending payment:", sumResult);

    res.status(200).json({ profit: sumResult });
  } catch (error) {
    console.error("Error calculating profit:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
