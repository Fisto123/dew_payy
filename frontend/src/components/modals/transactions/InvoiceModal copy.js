import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  CButton,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
} from "@coreui/react";
import axiosInstance from "src/utils/newRequest";
import { useAllBillCode, useDataCorporates } from "src/Hooks/fetchApiHooks";
import { decodeTokenFromStorage } from "src/utils/storage";

const InvoiceModal = ({ visible, setVisible, bill }) => {
  const nav = useNavigate();

  const [formValues, setFormValues] = useState({
    customerfirstname: "",
    customerlastname: "",
    customeremail: "",
    phonenumber: "",
    bills: [],
  });
  const { data: corpdata } = useDataCorporates();
  const [code, setCode] = useState("");
  let info = decodeTokenFromStorage();
  const { data: billdata } = useAllBillCode(code, info?.orgid);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  console.log(billdata);
  const addBill = () => {
    if (code && billdata?.amount) {
      setFormValues((prevValues) => ({
        ...prevValues,
        bills: [...prevValues.bills, { code, amount: billdata.amount }],
      }));
    }
  };
  console.log(formValues);
  const removeBill = (index) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      bills: prevValues.bills.filter((_, i) => i !== index),
    }));
  };
  const renderBills = () => {
    return formValues.bills.map((bill, index) => (
      <div key={index}>
        <h3>Bill {index + 1}</h3>
        <label>Code:</label>
        <p>{bill.code}</p>
        <label>Amount:</label>
        <p>{bill.amount}</p>
        {/* Add any other details you want to display */}
      </div>
    ));
  };
  const BrowserDefaults = () => {
    const [validated, setValidated] = useState(false);
    const handleSubmit = async (event) => {
      const form = event.currentTarget;
      event.preventDefault();

      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        setValidated(true);
        try {
          const orgid = decodeTokenFromStorage().orgid;
          const response =
            orgid && bill && bill?.billerid
              ? await axiosInstance.patch(
                  `/editbill/${bill?.billerid}`,
                  formValues
                )
              : orgid &&
                (await axiosInstance.post(`/generatebill`, formValues));
          if (response.status === 201) {
            nav("/");
            alert(response.data.message);
          }
        } catch (error) {
          console.log(error);
          alert(error?.response?.data?.message);
        }
      }
    };

    const isFormValid = () => {
      const requiredFieldsFilled = Object.values(formValues).every(
        (value) => value !== ""
      );

      return requiredFieldsFilled;
    };
    console.log(formValues);
    return (
      <>
        <CModal
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="LiveDemoExampleLabel">
          <CForm
            className="row g-4 needs-validation p-3"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}>
            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor="validationTooltip01">firstname</CFormLabel>
              <CFormInput
                type="text"
                id="validationTooltip01"
                required
                style={{ height: "50px" }}
                onChange={(e) => handleChange(e)}
                value={formValues.customerfirstname}
                name="customerfirstname"
              />
              <CFormFeedback
                tooltip
                invalid
                style={{ background: "none", color: "red" }}>
                Please input firstname.
              </CFormFeedback>
            </CCol>
            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor="validationTooltip01">lastname</CFormLabel>
              <CFormInput
                type="text"
                id="validationTooltip01"
                required
                style={{ height: "50px" }}
                onChange={(e) => handleChange(e)}
                value={formValues.customerlastname}
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
              <CFormLabel htmlFor="validationTooltip02">
                Phone number
              </CFormLabel>
              <CFormInput
                //defaultValue={bill && bill?.billerid ? bill?.amount : ""}
                onChange={(e) => handleChange(e)}
                value={formValues.phonenumber}
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
                customer email
              </CFormLabel>
              <CFormInput
                type="email"
                id="validationTooltip01"
                required
                style={{ height: "50px" }}
                onChange={(e) => handleChange(e)}
                value={formValues.customeremail}
                name="customeremail"
              />
              <CFormFeedback
                tooltip
                invalid
                style={{ background: "none", color: "red" }}>
                Please input email.
              </CFormFeedback>
            </CCol>
            {/* ... (previous code) */}
            {formValues.bills.map((bill, index) => (
              <div key={index}>
                <label>
                  Bill Code:
                  <input
                    type="text"
                    name="code"
                    value={bill.code}
                    onChange={(e) => handleChange(e, index)}
                  />
                </label>
                <label>
                  Amount:
                  <input
                    type="text"
                    name="amount"
                    value={bill.amount}
                    onChange={(e) => handleChange(e, index)}
                  />
                </label>
              </div>
            ))}
            <CButton onClick={addBill}>Add Bill</CButton>

            <CCol xs={12} className="position-relative">
              <CButton color="primary" type="submit" disabled={!isFormValid()}>
                Submit form
              </CButton>
            </CCol>
          </CForm>
        </CModal>
      </>
    );
  };
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px",
        }}>
        <CCol xs={12} md={10}>
          <CCard className="mb-4">
            <h4 className="p-3 d-flex justify-content-center text-uppercase fw-bolder">
              Register Corporate
            </h4>
            <h7 className="p-3 d-flex justify-content-center">
              Register new corporate to start enjoying dew pay payments solution
            </h7>
            <CCardBody>{BrowserDefaults()}</CCardBody>
          </CCard>
        </CCol>
      </CContainer>
    </div>
  );
};
InvoiceModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.bool.isRequired,
  bill: PropTypes.object,
};
export default InvoiceModal;
