import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CButton,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
} from "@coreui/react";
import { useDataUser } from "src/Hooks/fetchApiHooks";
import { nigerianStates } from "src/utils/data";
import axiosInstance from "src/utils/newRequest";
import { decodeTokenFromStorage } from "src/utils/storage";
import { Details } from "@mui/icons-material";

const CorporateInformation = () => {
  const [validated, setValidated] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({
    CAC: null,
    utility: null,
  });
  let info = decodeTokenFromStorage();
  let ownerspermission = info?.roles.includes("product_owner");
  const { orgid } = useParams();

  let realorgid = ownerspermission ? orgid : info?.orgid;
  const { data } = useDataUser(realorgid);
  console.log(data);
  const [details, setDetails] = useState({
    RCNo: "",
    status: "pending",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDetails((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  useEffect(() => {
    if (data) {
      setDetails({
        RCNo: data?.corporatedocumentinfo?.RCNo || "",
        // Set initial values for utility and cac based on the existing selectedFiles state
        utility: data?.corporatedocumentinfo?.utility || "",
        cac: data?.corporatedocumentinfo?.CAC || "",
        status: "pending" || "",
      });
    }
  }, [data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setValidated(true);
      try {
        const formData = new FormData();
        formData.append("RCNo", details.RCNo);
        formData.append("cac", selectedFiles.CAC);
        formData.append("utility", selectedFiles.utility);
        formData.append("status", details.status);

        const response = await axiosInstance.patch(
          `/updateCorporateIdentity/${realorgid}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          alert(response?.data?.message);
          // window.location.reload();
        }
      } catch (error) {
        let logs = error?.response?.data?.errors;
        logs?.forEach((error) => {
          alert(`${error.field}: ${error.message}`);
        }) || alert(error?.response?.data?.error);
      }
    }
  };
  console.log(data?.status);

  const isFormValid = () => {
    const requiredFieldsFilled = Object.entries(details).every(
      ([_, value]) => value !== ""
    );
    return requiredFieldsFilled && selectedFiles.utility && selectedFiles.CAC;
  };

  const handleFileChange = (event, fileType) => {
    const file = event.target.files[0];
    setSelectedFiles((prevFiles) => ({
      ...prevFiles,
      [fileType]: file,
    }));
  };
  console.log(data?.corporatedocumentinfo?.CAC);
  return (
    <div>
      <CForm
        onSubmit={handleSubmit}
        className="row g-4 needs-validation d-flex justify-content-center"
        noValidate
        validated={validated}>
        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="validationTooltip04">RCNo</CFormLabel>
          <CFormInput
            defaultValue={data?.corporatedocumentinfo?.RCNo}
            name="RCNo"
            type="text"
            id="validationTooltip02"
            required
            onChange={handleChange}
            disabled={
              data?.corporatedocumentinfostatus === "approved" &&
              !ownerspermission
            }
          />
        </CCol>

        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="utilityFile">Utility bill</CFormLabel>
          <input
            name="utility"
            type="file"
            className="form-control"
            id="utilityFile"
            onChange={(e) => handleFileChange(e, "utility")}
            disabled={
              data?.corporatedocumentinfostatus === "approved" &&
              !ownerspermission
            }
          />

          <CFormFeedback
            tooltip
            invalid
            style={{ background: "none", color: "red" }}>
            Please upload the utility bill.
          </CFormFeedback>
        </CCol>

        <CCol md={12} className="position-relative">
          <CFormLabel htmlFor="cacFile">CAC Document</CFormLabel>
          <input
            type="file"
            className="form-control"
            id="cacFile"
            onChange={(e) => handleFileChange(e, "CAC")}
            name="CAC"
            disabled={
              data?.corporatedocumentinfostatus === "approved" &&
              !ownerspermission
            }
          />

          <CFormFeedback
            tooltip
            invalid
            style={{ background: "none", color: "red" }}>
            Please upload the CAC Document.
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
              value={details?.status}
              required
              name="status">
              <option selected disabled>
                Choose...
              </option>
              <option>approved</option>
              <option>rejected</option>
              <option>pending</option>
            </CFormSelect>
          </CCol>
        )}

        <div className="d-flex justify-content-end">
          <CButton
            disabled={
              data?.corporatedocumentinfostatus === "approved" &&
              !ownerspermission
            }
            type="submit"
            color="primary">
            Submit
          </CButton>
        </div>
      </CForm>
    </div>
  );
};

export default CorporateInformation;

// import React, { useState } from "react";
// import Viewer from "react-viewer";

// const CorporateInformation = () => {
//   const [visible, setVisible] = useState(false);
//   const [activeIndex, setActiveIndex] = useState(0); // Index of the active item

//   const imagesAndPDFs = [
//     {
//       src: "/Users/fisto/Desktop/dewpay/dew_payy/backend/public/images/1701214792842.jpeg",
//       alt: "Image 1",
//     },
//     { src: "path/to/document.pdf", alt: "PDF Document" },
//     // Add more items as needed
//   ];

//   return (
//     <div>
//       <button
//         onClick={() => {
//           setVisible(true);
//         }}>
//         show
//       </button>
//       <button
//         onClick={() => {
//           setVisible(false);
//         }}>
//         close
//       </button>
//       <Viewer
//         visible={visible}
//         onClose={() => {
//           setVisible(false);
//         }}
//         images={[
//           {
//             src: "https://images.unsplash.com/photo-1682687219356-e820ca126c92?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8",
//             alt: "",
//           },
//           {
//             src: "https://images.unsplash.com/photo-1700925338124-feb7c3dae1d9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D",
//             alt: "",
//           },
//         ]}
//       />
//     </div>
//   );
// };

// export default CorporateInformation;
