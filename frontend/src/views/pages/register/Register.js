import { CCard, CCardBody, CCol, CContainer } from "@coreui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CButton,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormTextarea,
  CInputGroup,
} from "@coreui/react";
import axiosInstance from "src/utils/newRequest";

const Register = () => {
  const nav = useNavigate();
  const [formValues, setFormValues] = useState({
    firstname: "",
    surname: "",
    email: "",
    password: "",
    companyname: "",
    phonenumber: "",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const BrowserDefaults = () => {
    const [validated, setValidated] = useState(false);
    const handleSubmit = async (event) => {
      const form = event.currentTarget;
      console.log(form);
      event.preventDefault();

      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        setValidated(true);
        try {
          const response = await axiosInstance.post(
            `/registercorporate`,
            formValues
          );
          if (response.status === 201) {
            nav("/login");
            alert(response.data.message);
          }
        } catch (error) {
          let logs = error.response.data.errors;
          logs?.forEach((error) => {
            alert(`${error.field}: ${error.message}`);
          }) || alert(error.response.data.error);
        }
      }
    };

    const isFormValid = () => {
      const requiredFieldsFilled = Object.values(formValues).every(
        (value) => value !== ""
      );
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email);
      return requiredFieldsFilled && emailValid;
    };
    return (
      <CForm
        className="row g-4 needs-validation "
        noValidate
        validated={validated}
        onSubmit={handleSubmit}>
        <CCol className="position-relative">
          <CFormLabel htmlFor="validationTooltip01">Firstname</CFormLabel>
          <CFormInput
            type="text"
            id="validationTooltip01"
            required
            style={{ height: "50px" }}
            onChange={handleChange}
            name="firstname"
          />
          <CFormFeedback
            tooltip
            invalid
            style={{ background: "none", color: "red" }}>
            Please input your firstname.
          </CFormFeedback>
        </CCol>
        <CCol md={6} className="position-relative">
          <CFormLabel htmlFor="validationTooltip02">Lastname</CFormLabel>
          <CFormInput
            onChange={handleChange}
            name="surname"
            type="text"
            id="validationTooltip02"
            style={{ height: "50px" }}
            required
          />
          <CFormFeedback
            tooltip
            invalid
            style={{ background: "none", color: "red" }}>
            Please input your lastname.
          </CFormFeedback>
        </CCol>
        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="validationTooltipUsername">
            Companys name
          </CFormLabel>
          <CInputGroup className="has-validation">
            <CFormTextarea
              onChange={handleChange}
              name="companyname"
              type="text"
              id="validationTooltipcrname"
              defaultValue=""
              aria-describedby="inputGroupPrepend"
              required
            />
            <CFormFeedback
              tooltip
              invalid
              style={{ background: "none", color: "red" }}>
              Please choose your companys name.
            </CFormFeedback>
          </CInputGroup>
        </CCol>
        <CCol md={6} className="position-relative">
          <CFormLabel htmlFor="validationTooltip03">Email</CFormLabel>
          <CFormInput
            onChange={handleChange}
            name="email"
            type="email"
            id="validationTooltip03"
            required
          />
          <CFormFeedback
            tooltip
            invalid
            style={{ background: "none", color: "red" }}>
            Please provide a valid email.
          </CFormFeedback>
        </CCol>
        <CCol md={6} className="position-relative">
          <CFormLabel htmlFor="validationTooltipUsername">
            Companys phone
          </CFormLabel>
          <CInputGroup className="has-validation">
            <CFormInput
              type="number"
              onChange={handleChange}
              name="phonenumber"
              id="validationTooltipcrname"
              defaultValue=""
              aria-describedby="inputGroupPrepend"
              required
            />
            <CFormFeedback
              tooltip
              invalid
              style={{ background: "none", color: "red" }}>
              Please choose your companys phone number.
            </CFormFeedback>
          </CInputGroup>
        </CCol>

        <CCol md={6} className="position-relative">
          <CFormLabel htmlFor="validationTooltip02">Password</CFormLabel>
          <CFormInput
            onChange={handleChange}
            name="password"
            type="password"
            id="validationTooltip02"
            required
          />
          <CFormFeedback
            tooltip
            invalid
            style={{ background: "none", color: "red" }}>
            Please input your password.
          </CFormFeedback>
        </CCol>
        <CCol xs={12} className="position-relative">
          <CButton color="primary" type="submit" disabled={!isFormValid()}>
            Submit form
          </CButton>
        </CCol>
      </CForm>
    );
  };
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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

export default Register;
