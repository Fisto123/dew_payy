import React, { useEffect, useState } from "react";
import {
  CButton,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CFormSelect,
  CInputGroup,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { decodeTokenFromStorage } from "src/utils/storage";
import axiosInstance from "src/utils/newRequest";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useDataCorporates } from "src/Hooks/fetchApiHooks";

const DeptModal = ({ visible, setVisible, dept }) => {
  const [validated, setValidated] = useState(false);
  const { data } = useDataCorporates();

  let info = decodeTokenFromStorage();
  let ownerspermission = info?.roles.includes("product_owner");
  let nav = useNavigate();
  const [deptValues, setDeptValues] = useState({
    name: "",
    description: "",
    orgid: ownerspermission ? "" : info.orgid,
    userid: ownerspermission ? "" : info.id,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDeptValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
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
          orgid && dept && dept?.departmentid
            ? await axiosInstance.patch(
                `/editdepartment/${dept?.departmentid}`,
                deptValues
              )
            : orgid &&
              (await axiosInstance.post(`/registerdepartment`, deptValues));
        if (response.status === 201) {
          nav("/department-management");
          alert(response.data.message);
          window.location.reload();
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
    const requiredFieldsFilled = Object.entries(deptValues)
      .filter(([key]) => key !== "userid") // Exclude 'userid'
      .every(([, value]) => value !== "");

    return requiredFieldsFilled;
  };

  useEffect(() => {
    if (dept) {
      setDeptValues({
        name: dept.name || "",
        description: dept.description || "",
      });
    }
  }, [dept]);
  return (
    <>
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel">
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle id="LiveDemoExampleLabel">
            {dept && dept.departmentid ? "EDIT DEPARTMENT" : "ADD DEPARTMENT"}
          </CModalTitle>
        </CModalHeader>
        <CForm
          className="row g-4 needs-validation d-flex justify-content-center "
          noValidate
          validated={validated}
          onSubmit={handleSubmit}>
          {ownerspermission && (
            <CCol md={10} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Corporates</CFormLabel>
              <CFormSelect
                disabled={dept?.departmentid}
                onChange={handleChange}
                id="validationTooltip04"
                required
                name="orgid"
                // defaultChecked={dept && dept.departmentid ? deptValues.orgid : 'ww'}
              >
                <option selected disabled>
                  Choose...
                </option>
                {data &&
                  data.map((dat, index) => (
                    <option key={index} value={dat?.organizationid}>
                      {dat?.companyname}
                    </option>
                  ))}
              </CFormSelect>
              <CFormFeedback tooltip invalid>
                Please provide a valid department.
              </CFormFeedback>
            </CCol>
          )}

          <CCol md={10} className="position-relative">
            <CFormLabel htmlFor="validationTooltip02">
              Departments name
            </CFormLabel>
            <CFormInput
              onChange={handleChange}
              name="name"
              type="text"
              id="validationTooltip02"
              style={{ height: "50px" }}
              required
              defaultValue={dept && dept?.departmentid ? dept?.name : ""}
            />
            <CFormFeedback
              tooltip
              invalid
              style={{ background: "none", color: "red" }}>
              Please input your departments name.
            </CFormFeedback>
          </CCol>
          <CCol md={10} className="position-relative">
            <CFormLabel htmlFor="validationTooltipUsername">
              Companys description
            </CFormLabel>
            <CInputGroup className="has-validation">
              <CFormTextarea
                onChange={handleChange}
                name="description"
                type="text"
                id="validationTooltipcrname"
                defaultValue={
                  dept && dept?.departmentid ? deptValues?.description : ""
                }
                aria-describedby="inputGroupPrepend"
                required
              />
              <CFormFeedback
                tooltip
                invalid
                style={{ background: "none", color: "red" }}>
                Please choose your companys desc.
              </CFormFeedback>
            </CInputGroup>
          </CCol>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
              Cancel
            </CButton>
            <CButton type="submit" color="primary" disabled={!isFormValid()}>
              {dept && dept.departmentid ? "EDIT DEPARTMENT" : "ADD DEPARTMENT"}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  );
};
DeptModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.bool.isRequired,
  dept: PropTypes.object,
};

export default DeptModal;
