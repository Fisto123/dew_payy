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
import React, { useEffect, useState } from "react";
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
import { Checkbox, FormControlLabel } from "@mui/material";
import { useDataCorporates } from "src/Hooks/fetchApiHooks";
import { decodeTokenFromStorage } from "src/utils/storage";
import { BASEURL } from "src/utils/constant";

const Addbillmodal = ({ visible, setVisible, bill }) => {
  const nav = useNavigate();
  const { data: corpdata } = useDataCorporates();
  let info = decodeTokenFromStorage();
  let ownerspermission = info && info?.roles.includes("product_owner");
  const [orgdept, setOrgDept] = useState([]);
  const [formValues, setFormValues] = useState({
    billcode: "",
    amount: "",
    billdescription: "",
    departmentid: "",
    orgid: ownerspermission ? "" : info.orgid,
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (bill) {
      setFormValues({
        billcode: bill.billcode || "",
        amount: bill.amount || "",
        billdescription: bill.billdescription || "",
        departmentid: bill?.departmentid,
        orgid: ownerspermission ? bill?.organizationid : info.orgid,
      });
    }
  }, [bill]);
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get(
          `${BASEURL}/searchorgdept/${
            bill?.organizationid || formValues?.orgid
          }`
        );
        setOrgDept(response.data);
      } catch (error) {
        console.log(error);
      } finally {
      }
    };
    fetchDepartments();
  }, [formValues.orgid, bill?.organizationid]);
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
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle id="LiveDemoExampleLabel">
              {bill && bill.billerid ? "EDIT BILL" : "ADD BILL"}
            </CModalTitle>
          </CModalHeader>
          <CForm
            className="row g-4 needs-validation p-3"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}>
            {ownerspermission && (
              <CCol md={12} className="position-relative">
                <CFormLabel htmlFor="validationTooltip04">
                  Corporates
                </CFormLabel>
                <CFormSelect
                  onChange={handleChange}
                  id="validationTooltip04"
                  required
                  name="orgid"
                  disabled={bill && bill.billerid}
                  // defaultChecked={dept && dept.departmentid ? deptValues.orgid : 'ww'}
                >
                  <option selected disabled>
                    Choose...
                  </option>
                  {corpdata &&
                    corpdata.map((dat, index) => (
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

            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor="validationTooltip01">Bill code</CFormLabel>
              <CFormInput
                type="text"
                id="validationTooltip01"
                required
                style={{ height: "50px" }}
                onChange={handleChange}
                defaultValue={bill && bill?.billerid ? bill?.billcode : ""}
                name="billcode"
              />
              <CFormFeedback
                tooltip
                invalid
                style={{ background: "none", color: "red" }}>
                Please input billcode.
              </CFormFeedback>
            </CCol>
            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor="validationTooltip02">Price</CFormLabel>
              <CFormInput
                defaultValue={bill && bill?.billerid ? bill?.amount : ""}
                onChange={handleChange}
                name="amount"
                type="number"
                id="validationTooltip02"
                style={{ height: "50px" }}
                required
              />
              <CFormFeedback
                tooltip
                invalid
                style={{ background: "none", color: "red" }}>
                Please input the price.
              </CFormFeedback>
            </CCol>
            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor="validationTooltip03">
                Bill description
              </CFormLabel>
              <CFormInput
                onChange={handleChange}
                name="billdescription"
                type="text"
                defaultValue={
                  bill && bill?.billerid ? bill?.billdescription : ""
                }
                id="validationTooltip03"
                required
              />
              <CFormFeedback
                tooltip
                invalid
                style={{ background: "none", color: "red" }}>
                Please provide description.
              </CFormFeedback>
            </CCol>
            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Department</CFormLabel>
              <CFormSelect
                onChange={handleChange}
                id="validationTooltip04"
                required
                name="departmentid"
                defaultValue={bill && bill?.department ? bill?.department : ""}>
                <option selected disabled>
                  Choose...
                </option>
                {orgdept &&
                  orgdept.map((dat, index) => (
                    <option key={index} value={dat?.departmentid}>
                      {dat.name}
                    </option>
                  ))}
              </CFormSelect>
              <CFormFeedback tooltip invalid>
                Please provide a valid department.
              </CFormFeedback>
            </CCol>
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
Addbillmodal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.bool.isRequired,
  bill: PropTypes.object,
};
export default Addbillmodal;
