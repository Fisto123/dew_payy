import { Op, Sequelize } from "sequelize";
import db, { sequelize } from "../model/index.js";

const Invoice = db.invoice;
const Biller = db.biller;

export const generateInvoice = async (req, res, next) => {
  const { customerfirstname, customerlastname, customeremail, bills } =
    req.body;
  const { orgid } = req.params;

  try {
    // Create the invoice
    const invoice = await Invoice.create({
      organizationid: orgid,
      customerfirstname,
      customerlastname,
      customeremail,
      billings: bills,
    });
    const billingRecords = await Biller.findAll({
      where: {
        billerid: {
          [Op.in]: bills,
        },
      },
    });

    const totalAmount = billingRecords.reduce(
      (sum, billing) => sum + parseFloat(billing.amount),
      0
    );
    console.log(invoice.invoiceid);
    // Update the created invoice with the calculated total amount
    await Invoice.update(
      { totalAmount: totalAmount, amountdue: totalAmount }, // Adjust the rounding if needed
      { where: { invoiceid: invoice.invoiceid } }
    );
    return res.status(201).json({
      message: "Invoice and associated bills generated successfully",
      invoiceId: invoice,
    });
  } catch (error) {
    next(error);
  }
};
export const getInvoice = async (req, res, next) => {
  try {
    let { orgid } = req.params;

    // Find the invoice data
    let invoiceData = await Invoice.findOne({
      where: { organizationid: orgid },
    });

    if (!invoiceData) {
      return res.status(404).send("Invoice not found");
    }

    const billingsArray = invoiceData.dataValues.billings;

    // Use Sequelize to find the billing records
    const billingRecords = await Biller.findAll({
      where: {
        billerid: {
          [Op.in]: billingsArray,
        },
      },
    });

    // Combine and send the data as a response
    const responseData = {
      invoiceData: invoiceData.dataValues,
      billingRecords: billingRecords,
      totalAmount: invoiceData.totalAmount,
    };

    return res.status(200).send(responseData);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getSingleInvoice = async (req, res, next) => {
  try {
    let { invoiceid } = req.params;

    // Find the invoice data
    let invoiceData = await Invoice.findOne({
      where: { invoiceid },
    });

    if (!invoiceData) {
      return res.status(404).send("Invoice not found");
    }

    const billingsArray = invoiceData.dataValues.billings;

    // Use Sequelize to find the billing records
    const billingRecords = await Biller.findOne({
      where: {
        billerid: {
          [Op.in]: billingsArray,
        },
      },
    });
    const totalAmount = billingRecords.reduce(
      (sum, billing) => sum + parseFloat(billing.amount),
      0
    );

    // Combine and send the data as a response
    const responseData = {
      invoiceData: invoiceData.dataValues,
      billingRecords: billingRecords,
      totalAmount: totalAmount,
    };

    return res.status(200).send(responseData);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const payInvoice = async (req, res) => {
  let { invoiceid } = req.params;

  try {
    let invoiceData = await Invoice.findOne({
      where: { invoiceid },
    });
    if (invoiceData) {
      await Invoice.update(
        {
          status: "paid",
          amountpaid: invoiceData.totalAmount,
        },
        {
          where: { invoiceid: invoiceData.invoiceid },
        }
      );
      res.status(200).send({ message: "full payment made successfully" });
    } else {
      res.status(404).send({ message: "invoice doesnt exist" });
    }
  } catch (error) {
    console.log(error);
  }
};

export const paypartialInvoice = async (req, res) => {
  let { invoiceid } = req.params;
  let { partamount } = req.body;

  try {
    let invoiceData = await Invoice.findOne({
      where: { invoiceid },
    });

    if (invoiceData) {
      // Check if the partial amount is less than or equal to the total amount
      if (partamount <= invoiceData.totalAmount) {
        // Update the invoice with the partial payment
        await Invoice.update(
          {
            amountpaid: sequelize.literal(`amountpaid + ${partamount}`),
          },
          {
            where: { invoiceid: invoiceData.invoiceid },
          }
        );

        // Check if the total amount is reached, mark the invoice as paid
        if (invoiceData.amountpaid + partamount >= invoiceData.totalAmount) {
          await Invoice.update(
            {
              status: "paid",
            },
            {
              where: { invoiceid: invoiceData.invoiceid },
            }
          );
          res.status(200).send({ message: "Full payment made successfully" });
        } else {
          res
            .status(200)
            .send({ message: "Partial payment made successfully" });
        }
      } else {
        res
          .status(400)
          .send({ message: "Partial amount exceeds total amount" });
      }
    } else {
      res.status(404).send({ message: "Invoice does not exist" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};
