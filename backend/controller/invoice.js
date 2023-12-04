import { Op, Sequelize } from "sequelize";
import db, { sequelize } from "../model/index.js";

const Invoice = db.invoice;
const Biller = db.biller;
const Payment = db.payment;

// include: [
//           {
//             model: User,
//             as: "user",
//             attributes: ["companyname"],
//           },
//         ],
export const generateInvoice = async (req, res, next) => {
  console.log(req.user.orgid);
  const {
    customerfirstname,
    customerlastname,
    customeremail,
    bills,
    phonenumber,
  } = req.body;

  if (
    !customerfirstname ||
    !customerlastname ||
    !customeremail ||
    !bills ||
    !phonenumber
  ) {
    return res.status(404).json({
      message: "Fill all fields",
    });
  }

  try {
    // Create the invoice
    const invoice = await Invoice.create({
      organizationid: req.user.orgid,
      customerfirstname,
      customerlastname,
      customeremail,
      phonenumber,
      billings: bills,
    });

    // Calculate total amount
    const totalAmount = bills.reduce(
      (sum, billing) => sum + parseFloat(billing.amount),
      0
    );
    console.log("Total Amount:", totalAmount);

    // Update the created invoice with the calculated total amount
    await Invoice.update(
      { totalAmount, amountdue: totalAmount },
      { where: { invoiceid: invoice.invoiceid } }
    );

    return res.status(201).json({
      message: "Invoice and associated bills generated successfully",
      invoiceId: invoice,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const getInvoice1 = async (req, res, next) => {
  try {
    let { invoiceid } = req.params;

    // Find the invoice data
    let invoiceData = await Invoice.findOne({
      where: { organizationid: req.user.orgid, invoiceid },
    });
    let paymentData = await Payment.findAll({
      where: { invoiceid },
    });
    return res.status(200).send({ invoiceData, paymentData });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
export const getAllInvoices = async (req, res, next) => {
  try {
    let { orgid } = req.params;
    console.log(orgid);
    let invoices = await Invoice.findAll({
      order: [["createdAt", "DESC"]],
      where: { organizationid: req.user.orgid },
    });

    return res.status(200).send(invoices);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

// export const payInvoice = async (req, res) => {
//   let { invoiceid } = req.params;

//   try {
//     let invoiceData = await Invoice.findOne({
//       where: { invoiceid },
//     });
//     if (invoiceData) {
//       await Invoice.update(
//         {
//           status: "paid",
//           amountpaid: invoiceData.totalAmount,
//         },
//         {
//           where: { invoiceid: invoiceData.invoiceid },
//         }
//       );
//       res.status(200).send({ message: "full payment made successfully" });
//     } else {
//       res.status(404).send({ message: "invoice doesnt exist" });
//     }
//   } catch (error) {
//     res.status(500).send("internal server error");
//   }
// };
export const payInvoice = async (req, res) => {
  let { invoiceid } = req.params;

  try {
    let invoiceData = await Invoice.findOne({
      where: { invoiceid },
    });

    if (invoiceData) {
      // Update the invoice status
      await Invoice.update(
        {
          status: "paid",
          amountpaid: invoiceData.totalAmount,
        },
        {
          where: { invoiceid: invoiceData.invoiceid },
        }
      );
      console.log(invoiceData);
      // Create a new payment record
      await Payment.create({
        invoiceid: invoiceData.invoiceid,
        amount: invoiceData.totalAmount,
        customer: invoiceData.customerfirstname,
        organizationid: req.user.orgid,
        // Other payment fields as needed
      });

      res.status(200).send({ message: "Full payment made successfully" });
    } else {
      res.status(404).send({ message: "Invoice doesn't exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
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
      //Check if the partial amount is a valid number
      if (isNaN(partamount) || partamount <= 0) {
        return res.status(400).send({ message: "Invalid partial amount" });
      }

      //Check if the partial amount is less than or equal to the remaining amount
      const remainingAmount = invoiceData.totalAmount - invoiceData.amountpaid;
      if (partamount <= remainingAmount) {
        //Update the invoice with the partial payment
        await Invoice.update(
          {
            amountpaid: sequelize.literal(`amountpaid + ${partamount}`),
            amountdue: sequelize.literal(`totalAmount - amountpaid`),
          },
          {
            where: { invoiceid: invoiceData.invoiceid },
          }
        );
        await Payment.create({
          organizationid: req.user.orgid,
          invoiceid: invoiceData.invoiceid,
          amount: partamount,
          customer: invoiceData.customerfirstname,
        });
        // 4000              2000               6000

        // console.log(
        //   Number(invoiceData.amountpaid) +
        //     Number(partamount) -
        //     invoiceData.totalAmount
        // );
        // console.log(
        //   Number(invoiceData.amountpaid) + Number(partamount),
        //   Number(invoiceData.totalAmount)
        // );
        // console.log(
        //   Number(invoiceData.amountpaid) + Number(partamount) >=
        //     Number(invoiceData.totalAmount)
        // );
        if (
          Number(invoiceData.amountpaid) + Number(partamount) >=
          Number(invoiceData.totalAmount)
        ) {
          await Invoice.update(
            {
              status: "paid",
            },
            {
              where: { invoiceid: invoiceData.invoiceid },
            }
          );
          return res.status(200).send({
            message: "Full payment made successfully",
          });
        } else {
          return res.status(200).send({
            message: "Partial payment made successfully",
          });
        }
        return res
          .status(200)
          .send({ message: "Partial payment made successfully" });
      } else {
        return res
          .status(400)
          .send({ message: "Partial amount exceeds remaining amount" });
      }
    } else {
      res.status(404).send({ message: "Invoice does not exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// [
//   {
//     invoiceid: "8ae5eee9-2df8-4957-9013-b4ad898e583b",
//     organizationid: "27266d90-26bf-4c62-9e28-0e59dd230ca8",
//     customerfirstname: "Iyiola",
//     customerlastname: "fisayo",
//     totalAmount: 5000000,
//     amountpaid: null,
//     amountdue: 5000000,
//     customeremail: "iyi@mailinator.com",
//     billings: ["744ce371-db7b-4a6e-960b-74e4ca95a25f"],
//     status: "pending",
//     createdAt: "2023-12-01T12:10:17.000Z",
//     updatedAt: "2023-12-01T12:10:17.000Z",
//   },
//   {
//     invoiceid: "ddee0f98-6c5e-4fae-9edb-35d28c34eab9",
//     organizationid: "27266d90-26bf-4c62-9e28-0e59dd230ca8",
//     customerfirstname: "adeola",
//     customerlastname: "ayoola",
//     totalAmount: 1000000,
//     amountpaid: null,
//     amountdue: 1000000,
//     customeremail: "ayoola@gmail.com",
//     billings: ["3f818f54-a50d-4377-9196-ef79f02bcc62"],
//     status: "pending",
//     createdAt: "2023-12-01T12:20:00.000Z",
//     updatedAt: "2023-12-01T12:20:00.000Z",
//   },
// ];
