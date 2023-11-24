import { Op, Sequelize } from "sequelize";
import db, { sequelize } from "../model/index.js";

const Invoice = db.invoice;
const Payment = db.payment;
export const makeFullPayment = async (req, res, next) => {
  const { orgid, amount } = req.body;
  const { invoiceid } = req.params;

  try {
    const payment = await Payment.create({
      invoiceid,
      organizationid: orgid,
      customer: "customer",
      amount,
    });

    const invoice = await Invoice.findOne({
      where: { invoiceid: payment.invoiceid },
    });

    if (invoice.status === "paid") {
      return res.status(404).send({
        message: "Payment already made",
      });
    } else {
      if (parseInt(amount, 10) === parseInt(invoice.totalAmount, 10)) {
        await Invoice.update(
          {
            status: "paid",
            amountpaid: invoice.totalAmount,
            amountdue: 0,
          },
          {
            where: { invoiceid: payment.invoiceid },
          }
        );
      } else {
        console.log("cant update yet");
      }

      return res.status(200).send({
        message: "Payment completed successfully",
      });
    }
    // Check if the amount paid equals the total amount
  } catch (error) {
    next(error);
  }
};

export const makePartialPayment = async (req, res, next) => {
  const { amount, orgid } = req.body;
  const { invoiceid } = req.params;

  try {
    // Create a payment record
    const payment = await Payment.create({
      invoiceid,
      organizationid: orgid,
      customer: "customer",
      amount,
    });

    // Find the associated invoice
    const invoice = await Invoice.findOne({
      where: { invoiceid: payment.invoiceid },
    });

    // Calculate the new amountpaid
    const newAmountPaid =
      parseInt(invoice.amountpaid, 10) + parseInt(amount, 10);

    const newAmountDue =
      parseInt(invoice.totalAmount, 10) - parseInt(newAmountPaid, 10);

    if (invoice.status === "paid") {
      return res.status(404).send({
        message: "payment already completed",
      });
    } else if (amount > invoice.amountdue) {
      return res.status(404).send({
        message: "exceeded limits",
      });
    }
    // Update the invoice with new amountpaid and amountdue
    await Invoice.update(
      {
        amountpaid: newAmountPaid,
        amountdue: newAmountDue,
      },
      {
        where: { invoiceid: payment.invoiceid },
      }
    );

    // Check if the total amount is reached after the partial payment
    if (newAmountPaid === invoice.totalAmount) {
      // Mark the invoice as 'paid'
      await Invoice.update(
        {
          status: "paid",
          amountdue: 0,
        },
        {
          where: { invoiceid: payment.invoiceid },
        }
      );
    }

    return res.status(201).send({
      message: "payment made successfully",
    });
  } catch (error) {
    next(error);
  }
};
