import React, { useState, useEffect } from "react";
import { useAllBillCode } from "src/Hooks/fetchApiHooks";
import { decodeTokenFromStorage } from "src/utils/storage";
import PropTypes from "prop-types";
import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CModal,
} from "@coreui/react";
import axiosInstance from "src/utils/newRequest";

const InvoiceModal = ({ visible, setVisible, bill }) => {
  const [code, setCode] = useState("");
  let info = decodeTokenFromStorage();
  const { data: billdata } = useAllBillCode(code, info?.orgid);
  const [formvalue, setFormValue] = useState({
    customerfirstname: "",
    customerlastname: "",
    customeremail: "",
    phonenumber: "",
    bills: [{ code: "", amount: "", billerid: "" }],
  });

  useEffect(() => {
    if (billdata) {
      setFormValue((prevCustomer) => ({
        ...prevCustomer,
        bills: prevCustomer.bills.map((bill) =>
          bill.code === code
            ? {
                ...bill,
                billerid: billdata.billerid,
                amount: billdata.amount || "",
              }
            : bill
        ),
      }));
    }
  }, [billdata, code]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "code") {
      // Set the code and reset the amount for the corresponding bill
      setCode(value);
      setFormValue((prevCustomer) => ({
        ...prevCustomer,
        bills: prevCustomer.bills.map((bill, i) =>
          i === index
            ? {
                ...bill,
                code: value,
                amount: billdata?.amount || "",
                billerid: billdata?.billerid || "", // Set the billerid
              }
            : bill
        ),
      }));
    } else if (name === "amount") {
      // Update the amount for the corresponding bill
      setFormValue((prevCustomer) => ({
        ...prevCustomer,
        bills: prevCustomer.bills.map((bill, i) =>
          i === index ? { ...bill, amount: value } : bill
        ),
      }));
    } else {
      // Update other fields
      setFormValue((prevCustomer) => ({
        ...prevCustomer,
        [name]: value,
      }));
    }
  };
  console.log(formvalue);
  const addBill = () => {
    if (billdata && billdata.billerid) {
      const isFormIncomplete =
        !formvalue.customerfirstname ||
        !formvalue.customerlastname ||
        !formvalue.phonenumber ||
        !formvalue.customeremail ||
        formvalue.bills.some(
          (bill) => !bill.code || !bill.amount || !bill.billerid
        );
      if (!isFormIncomplete) {
        setFormValue((prevFormValue) => ({
          ...prevFormValue,
          bills: [
            ...prevFormValue.bills,
            { code: "", amount: "", billerid: billdata.billerid },
          ],
        }));
      } else {
        console.log("Please complete the form before adding a bill");
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const backendData = {
      customerfirstname: formvalue.customerfirstname,
      customerlastname: formvalue.customerlastname,
      customeremail: formvalue.customeremail,
      phonenumber: formvalue.phonenumber,
      bills: formvalue.bills,
    };

    try {
      const orgid = decodeTokenFromStorage().orgid;
      if (orgid) {
        const response = await axiosInstance.post(
          `/generateinvoice`,
          backendData
        );

        if (response.status === 201) {
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
    <>
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel">
        <CForm
          className="row g-4 needs-validation p-3"
          noValidate
          onSubmit={handleSubmit}>
          <CCol md={6} className="position-relative">
            <CFormLabel htmlFor="validationTooltip01">Firstname</CFormLabel>
            <CFormInput
              type="text"
              id="validationTooltip01"
              required
              style={{ height: "50px" }}
              value={formvalue.customerfirstname}
              onChange={(e) => handleChange(e)}
              name="customerfirstname"
              placeholder="please input firstname...."
            />
            <CFormFeedback
              tooltip
              invalid
              style={{ background: "none", color: "red" }}>
              Please input firstname.
            </CFormFeedback>
          </CCol>
          <CCol md={6} className="position-relative">
            <CFormLabel htmlFor="validationTooltip01">Lastname</CFormLabel>
            <CFormInput
              type="text"
              id="validationTooltip01"
              placeholder="please input lastname...."
              required
              style={{ height: "50px" }}
              value={formvalue.customerlastname}
              onChange={(e) => handleChange(e)}
              name="customerlastname"
            />
            <CFormFeedback
              tooltip
              invalid
              style={{ background: "none", color: "red" }}>
              Please input lastname.
            </CFormFeedback>
          </CCol>

          <CCol md={6} className="position-relative">
            <CFormLabel htmlFor="validationTooltip02">Phone number</CFormLabel>
            <CFormInput
              placeholder="please input phone...."
              value={formvalue.phonenumber}
              onChange={(e) => handleChange(e)}
              name="phonenumber"
              type="number"
              id="validationTooltip02"
              style={{ height: "50px" }}
              required
            />
            <CFormFeedback
              tooltip
              invalid
              style={{ background: "none", color: "red" }}>
              Please input the phone number.
            </CFormFeedback>
          </CCol>
          <CCol md={6} className="position-relative">
            <CFormLabel htmlFor="validationTooltip01">
              Customer email
            </CFormLabel>
            <CFormInput
              type="email"
              placeholder="please input email...."
              id="validationTooltip01"
              required
              style={{ height: "50px" }}
              value={formvalue.email}
              onChange={(e) => handleChange(e)}
              name="customeremail"
            />
            <CFormFeedback
              tooltip
              invalid
              style={{ background: "none", color: "red" }}>
              Please input email.
            </CFormFeedback>
          </CCol>

          {formvalue.bills.map((bill, index) => (
            <React.Fragment key={index}>
              <CCol md={6} className="position-relative">
                <CFormLabel htmlFor="validationTooltip02">Bill Code</CFormLabel>
                <CFormInput
                  name="code"
                  placeholder="please input code...."
                  value={bill.code}
                  onChange={(e) => handleChange(e, index)}
                  type="text"
                  id="validationTooltip02"
                  style={{ height: "50px" }}
                  required
                />
                <CFormFeedback
                  tooltip
                  invalid
                  style={{ background: "none", color: "red" }}>
                  Please input the code.
                </CFormFeedback>
              </CCol>
              <CCol md={6} className="position-relative">
                <CFormLabel htmlFor="validationTooltip02">amount</CFormLabel>
                <CFormInput
                  name="amount"
                  value={formvalue.bills[index].amount}
                  disabled
                  onChange={(e) => handleChange(e, index)}
                  type="text"
                  id="validationTooltip02"
                  style={{ height: "50px" }}
                  required
                />
              </CCol>
            </React.Fragment>
          ))}
          <CButton
            style={{ backgroundColor: "red", border: "none" }}
            onClick={addBill}>
            Add Bill
          </CButton>
          <CButton color="primary" type="submit">
            Generate bill
          </CButton>
        </CForm>
      </CModal>
    </>
  );
};

InvoiceModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  bill: PropTypes.object,
};

export default InvoiceModal;
