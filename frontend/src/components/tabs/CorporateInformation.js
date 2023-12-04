import {
  CButton,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDataUser } from "src/Hooks/fetchApiHooks";
import { nigerianStates, status } from "src/utils/data";
import axiosInstance from "src/utils/newRequest";
import { decodeTokenFromStorage } from "src/utils/storage";

const CorporateInformation = () => {
  const [validated, setValidated] = useState(false);
  const { orgid } = useParams();
  let info = decodeTokenFromStorage();
  let ownerspermission = info?.roles.includes("product_owner");
  let realorgid = ownerspermission ? orgid : info?.orgid;
  const { data } = useDataUser(realorgid);

  const [details, setDetails] = useState({
    companyname: "",
    address1: "",
    address2: "",
    city: "",
    zipcode: "",
    state: "",
    status: "pending",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setDetails((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  console.log(data?.corporateidentitystatus);
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      setValidated(true);
      try {
        const response = await axiosInstance.patch(
          `/updateCorporateInformation/${realorgid}`,
          details
        );
        if (response.status === 200) {
          alert(response?.data?.message);
          window.location.reload();
        }
      } catch (error) {
        let logs = error?.response?.data?.errors;
        logs?.forEach((error) => {
          alert(`${error.field}: ${error.message}`);
        }) || alert(error?.response?.data?.error);
      }
    }
  };
  const isFormValid = () => {
    const requiredFieldsFilled = Object.entries(details).every(
      ([, value]) => value !== ""
    );
    return requiredFieldsFilled;
  };
  useEffect(() => {
    if (data) {
      setDetails({
        companyname: data?.companyname || "",
        address1: data?.corporateinformation?.address1 || "",
        address2: data?.corporateinformation?.address2 || "",
        city: data?.corporateinformation?.city || "",
        zipcode: data?.corporateinformation?.zipcode || "",
        state: data?.corporateinformation?.state || "",
        status: "pending" || "",
      });
    }
  }, [data]);
  console.log(isFormValid());
  console.log(details);
  return (
    <div>
      <CForm
        onSubmit={handleSubmit}
        className="row g-4 needs-validation d-flex justify-content-center "
        noValidate
        validated={validated}>
        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="validationTooltip04">Company Name</CFormLabel>
          <CFormInput
            name="companyname"
            disabled={
              data?.corporateidentitystatus === "approved" && !ownerspermission
            }
            type="text"
            id="validationTooltip02"
            required
            onChange={handleChange}
            defaultValue={data?.companyname || ""}
          />
        </CCol>

        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="validationTooltip02">Address</CFormLabel>
          <CFormInput
            onChange={handleChange}
            disabled={
              data?.corporateidentitystatus === "approved" && !ownerspermission
            }
            name="address1"
            type="text"
            id="validationTooltip02"
            style={{ height: "50px" }}
            defaultValue={data?.corporateinformation?.address1 || ""}
            required
          />
          <CFormFeedback
            tooltip
            invalid
            style={{ background: "none", color: "red" }}>
            Please input your address.
          </CFormFeedback>
        </CCol>
        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="validationTooltip02">Address 2</CFormLabel>
          <CFormInput
            onChange={handleChange}
            disabled={
              data?.corporateidentitystatus === "approved" && !ownerspermission
            }
            name="address2"
            type="text"
            id="validationTooltip02"
            style={{ height: "50px" }}
            defaultValue={data?.corporateinformation?.address2 || ""}
            required
          />
          <CFormFeedback
            tooltip
            invalid
            style={{ background: "none", color: "red" }}>
            Please input your second address.
          </CFormFeedback>
        </CCol>
        <CCol md={10} className="position-relative">
          <CFormLabel htmlFor="validationTooltip02">City</CFormLabel>
          <CFormInput
            onChange={handleChange}
            disabled={
              data?.corporateidentitystatus === "approved" && !ownerspermission
            }
            name="city"
            type="text"
            id="validationTooltip02"
            style={{ height: "50px" }}
            required
            defaultValue={data?.corporateinformation?.city}
          />
          <CFormFeedback
            tooltip
            invalid
            style={{ background: "none", color: "red" }}>
            Please input your second address.
          </CFormFeedback>
        </CCol>
        <CCol md={2} className="position-relative">
          <CFormLabel htmlFor="validationTooltip02">Zip Code</CFormLabel>
          <CFormInput
            disabled={
              data?.corporateidentitystatus === "approved" && !ownerspermission
            }
            onChange={handleChange}
            name="zipcode"
            type="number"
            id="validationTooltip02"
            style={{ height: "50px" }}
            defaultValue={data?.corporateinformation?.zipcode}
            required
          />
          <CFormFeedback
            tooltip
            invalid
            style={{ background: "none", color: "red" }}>
            Please input your second address.
          </CFormFeedback>
        </CCol>
        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="validationTooltip04">State</CFormLabel>
          <CFormSelect
            disabled={
              data?.corporateidentitystatus === "approved" && !ownerspermission
            }
            value={details.state}
            onChange={handleChange}
            id="validationTooltip04"
            required
            name="state">
            <option selected>Choose one...</option>
            {nigerianStates.map((dat, index) => (
              <option key={index} value={dat}>
                {dat}
              </option>
            ))}
          </CFormSelect>
          <CFormFeedback tooltip invalid>
            Please provide a state.
          </CFormFeedback>
        </CCol>
        {ownerspermission && (
          <CCol md={12} className="position-relative">
            <CFormLabel htmlFor="validationTooltip04">
              Select Approval
            </CFormLabel>
            <CFormSelect
              onChange={handleChange}
              id="validationTooltip04"
              required
              name="status">
              <option selected disabled>
                Choose...
              </option>
              {status &&
                status?.map((stat, index) => (
                  <option key={index}>{stat}</option>
                ))}
            </CFormSelect>
          </CCol>
        )}

        <div className="d-flex justify-content-end">
          <CButton
            type="submit"
            disabled={
              !isFormValid() ||
              (data?.corporateidentitystatus === "approved" &&
                !ownerspermission)
            }
            color="primary">
            Submit
          </CButton>
        </div>
      </CForm>
    </div>
  );
};

export default CorporateInformation;
