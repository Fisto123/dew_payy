import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { formatCurrency } from "src/utils/currency";
import { useGetInvoice } from "src/Hooks/fetchApiHooks";
import { decodeTokenFromStorage } from "src/utils/storage";
import moment from "moment";
import axiosInstance from "src/utils/newRequest";

export const InvoiceDetails = ({ visible, setVisible, transaction }) => {
  let info = decodeTokenFromStorage();
  const [amount, setAmount] = useState(0);
  const { data: invoiceData } = useGetInvoice(transaction?.invoiceid);
  const tableCellStyle = {
    border: "1px solid #dddddd",
    textAlign: "left",
    padding: "8px",
    backgroundColor: "#f2f2f2",
    textTransform: "uppercase",
    paddingTop: "5px",
  };
  const getBadge = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "secondary";
      default:
        return "primary";
    }
  };

  const payFull = async (e) => {
    try {
      const orgid = decodeTokenFromStorage().orgid;
      if (orgid) {
        const response = await axiosInstance.put(
          `/payfullinvoice/${transaction?.invoiceid}`
        );

        if (response.status === 200) {
          alert(response.data.message);
          window.location.reload();
          setVisible(false);
          return;
        }
      }

      throw new Error("Unexpected response status");
    } catch (error) {
      console.log(error);
      error && alert(error.response?.data?.message || "An error occurred");
    }
  };
  const payPartial = async (e) => {
    try {
      const orgid = decodeTokenFromStorage().orgid;
      if (orgid) {
        const response = await axiosInstance.put(
          `/paypartialInvoice/${transaction?.invoiceid}`,
          { partamount: amount }
        );

        if (response.status === 200) {
          alert(response.data.message);
          window.location.reload();
          setVisible(false);
          return;
        }
      }

      throw new Error("Unexpected response status");
    } catch (error) {
      console.log(error);
      error && alert(error.response?.data?.message || "An error occurred");
    }
  };
  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      aria-labelledby="LiveDemoExampleLabel"
      Adjust
      the
      value
      as
      needed>
      <CCard>
        <CCardBody>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}>
              <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                {transaction?.status === "paid" ? (
                  <div>View Receipt</div>
                ) : (
                  <div>View Invoice/bill</div>
                )}
                <div>
                  <CButton
                    style={{ width: "100%", color: "white" }}
                    color={getBadge(transaction?.status)}>
                    {transaction?.status}
                  </CButton>
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    textAlign: "center",
                  }}>
                  Reference
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: "bolder" }}>
                  {transaction?.invoiceid}
                </div>
              </div>
            </div>
            {transaction?.status === "paid" && (
              <img
                width="400"
                src="https://cdn1.vectorstock.com/i/1000x1000/66/10/paid-invoice-rubber-stamp-vector-11856610.jpg"
              />
            )}

            <div
              style={{
                fontWeight: "bolder",
                color: "green",
                paddingTop: "15px",
              }}>
              Amount due:
              {formatCurrency(transaction?.amountdue, "NGN", "en-NG")}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: "bolder" }}>BILL ITEMS</div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
              }}>
              <thead>
                <tr>
                  <th style={tableCellStyle}>Bill Code</th>
                  <th style={tableCellStyle}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {transaction &&
                  transaction?.billings.map((bill, index) => (
                    <tr key={index}>
                      <td style={tableCellStyle}>{bill.code}</td>
                      <td style={tableCellStyle}>
                        {formatCurrency(bill?.amount, "NGN", "en-NG")}
                      </td>
                    </tr>
                  ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      textAlign: "right",
                      paddingTop: "10px",
                      fontWeight: "bolder",
                    }}>
                    Total Amount:{" "}
                    {formatCurrency(transaction?.totalAmount, "NGN", "en-NG")}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div>
            <div style={{ color: "blue", fontWeight: "bolder" }}>
              PAYMENT HISTORY
            </div>
            <table style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Payment by</th>
                  <th>Amount paid</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transaction &&
                  invoiceData?.paymentData.map((invoice, index) => (
                    <tr>
                      <td style={tableCellStyle}>{invoice?.paymentid}</td>
                      <td style={tableCellStyle}>{invoice?.customer}</td>
                      <td style={tableCellStyle}>
                        {formatCurrency(invoice?.amount, "NGN", "en-NG")}
                      </td>
                      <td style={tableCellStyle}>
                        {moment(invoice?.createdAt).format("MM/DD/YY HH:mm:ss")}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {transaction?.status === "pending" && (
            <div
              style={{
                margin: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}>
              <CButton onClick={payFull}>Pay full</CButton>
              <div style={{ display: "flex", gap: 4 }}>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <CButton onClick={payPartial}>Pay partial</CButton>
              </div>
            </div>
          )}
        </CCardBody>
      </CCard>
    </CModal>
  );
};
InvoiceDetails.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.bool.isRequired,
  transaction: PropTypes.object,
};
