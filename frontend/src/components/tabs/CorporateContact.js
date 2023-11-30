import {
  CButton,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
} from "@coreui/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDataUser } from "src/Hooks/fetchApiHooks";
import { status } from "src/utils/data";
import axiosInstance from "src/utils/newRequest";
import { decodeTokenFromStorage } from "src/utils/storage";

const CorporateContact = () => {
  const initialFormState = { name: "", email: "", phone: "", address: "" };
  const { orgid } = useParams();
  let info = decodeTokenFromStorage();
  let ownerspermission = info?.roles.includes("product_owner");
  const [statuses, setStatuses] = useState("");
  console.log(statuses);
  let realorgid = ownerspermission ? orgid : info?.orgid;
  const { data } = useDataUser(realorgid);
  console.log(orgid);

  const [forms, setForms] = useState([initialFormState]);

  const [validations, setValidations] = useState([false]);

  const handleChange = (index, field, value) => {
    const newForms = [...forms];
    newForms[index][field] = value;
    setForms(newForms);

    // Check if the current form is completely filled
    const isFormValid =
      newForms[index].name !== "" &&
      newForms[index].email !== "" &&
      newForms[index].phone !== "" &&
      newForms[index].address !== "";

    // Update validation status for the current form
    const newValidations = [...validations];
    newValidations[index] = isFormValid;
    setValidations(newValidations);
  };

  const addForm = () => {
    // Check if all previous forms are completely filled
    if (validations.every((isValid) => isValid)) {
      setForms((prevForms) => [...prevForms, { ...initialFormState }]);
      setValidations((prevValidations) => [...prevValidations, false]);
    } else {
      alert("Please fill in the current form before adding a new one.");
    }
  };

  const removeForm = (index) => {
    setForms((prevForms) => prevForms.filter((_, i) => i !== index));
    setValidations((prevValidations) =>
      prevValidations.filter((_, i) => i !== index)
    );
  };
  console.log(statuses);
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      try {
        const response = await axiosInstance.patch(
          `/updatecorporatecontact/${realorgid}`,
          {
            forms: forms,
            status: orgid ? statuses : "pending",
          }
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
  useEffect(() => {
    // Fetch data when the component mounts
    if (data && data.corporatecontact && data.corporatecontact.length > 0) {
      // Assuming corporatecontacts is an array of objects with fields similar to initialFormState
      setForms(data.corporatecontact);
      setValidations(Array(data.corporatecontact.length).fill(true));
    } else {
      // If no data, load at least one form
      setForms([initialFormState]);
      setValidations([false]);
    }
  }, [data]);
  console.log(forms);

  return (
    <div>
      {forms.map((form, index) => (
        <CContainer key={index}>
          <CForm
            onSubmit={handleSubmit}
            className="row g-4 needs-validation"
            noValidate>
            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor={`name-${index}`}>Full Name</CFormLabel>
              <CFormInput
                type="text"
                id={`name-${index}`}
                required
                disabled={
                  data?.corporatecontactstatus === "approved" &&
                  !ownerspermission
                }
                value={form.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </CCol>

            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor={`email-${index}`}>Email</CFormLabel>
              <CFormInput
                type="text"
                disabled={
                  data?.corporatecontactstatus === "approved" &&
                  !ownerspermission
                }
                id={`email-${index}`}
                required
                value={form.email}
                onChange={(e) => handleChange(index, "email", e.target.value)}
              />
            </CCol>

            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor={`phone-${index}`}>Phonenumber</CFormLabel>
              <CFormInput
                disabled={
                  data?.corporatecontactstatus === "approved" &&
                  !ownerspermission
                }
                type="number"
                id={`phone-${index}`}
                required
                value={form.phone}
                onChange={(e) => handleChange(index, "phone", e.target.value)}
              />
            </CCol>

            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor={`address-${index}`}>address</CFormLabel>
              <CFormInput
                disabled={
                  data?.corporatecontactstatus === "approved" &&
                  !ownerspermission
                }
                type="text"
                id={`address-${index}`}
                required
                value={form.address}
                onChange={(e) => handleChange(index, "address", e.target.value)}
              />
            </CCol>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {index === forms.length - 1 && (
                <CButton
                  type="submit"
                  disabled={
                    data?.corporatecontactstatus === "approved" &&
                    !ownerspermission
                  }>
                  Submit
                </CButton>
              )}
            </div>
            {data?.corporatecontactstatus !== "approved" && (
              <div style={{ marginTop: 4 }}>
                {index === forms.length - 1 && (
                  <CButton
                    style={{ backgroundColor: "red", border: "none" }}
                    onClick={() => removeForm(index)}>
                    Remove Form
                  </CButton>
                )}
              </div>
            )}
            {data?.corporatecontactstatus !== "approved" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}>
                {index === forms.length - 1 && (
                  <CButton onClick={addForm}>Add Form</CButton>
                )}
              </div>
            )}
          </CForm>
        </CContainer>
      ))}
      {ownerspermission && (
        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="validationTooltip04">Select Approval</CFormLabel>
          <CFormSelect
            id="validationTooltip04"
            onChange={(e) => setStatuses(e.target.value)}
            required
            name="statuses">
            <option selected disabled>
              Choose...
            </option>
            {status &&
              status?.map((stat, index) => <option key={index}>{stat}</option>)}
          </CFormSelect>
        </CCol>
      )}
    </div>
  );
};

export default CorporateContact;
