import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CorporateInformation from "src/components/tabs/CorporateInformation";
import { useDataUser } from "src/Hooks/fetchApiHooks";
import CorporateIdentity from "src/components/tabs/CorporateIdentity";
import { decodeTokenFromStorage } from "src/utils/storage";
import { useParams } from "react-router-dom";
import { CButton } from "@coreui/react";
import CorporateContact from "src/components/tabs/CorporateContact";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}>
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    </>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CorporateSettings() {
  const [value, setValue] = React.useState(0);
  const { orgid } = useParams();
  let info = decodeTokenFromStorage();

  let ownerspermission = info?.roles.includes("product_owner");

  let realorgid = ownerspermission ? orgid : info?.orgid;
  const { data } = useDataUser(realorgid);
  console.log(data);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const getBadge = (status) => {
    console.log(status);
    switch (status) {
      case "pending":
        return "#FFD700";
      case "approved":
        return "#00FF00";
      case "rejected":
        return "red";
      case "not_submitted":
        return "none";
      default:
        return "transparent";
    }
  };
  console.log(data);
  return (
    <>
      <div className="d-flex  justify-content-end "></div>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example">
            <Tab
              label="CORPORATE INFORMATION"
              style={{ flex: 1, maxWidth: "50%" }}
              {...a11yProps(0)}
            />
            <CButton
              style={{
                marginTop: "10px",
                background: getBadge(data?.corporateidentitystatus),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "0.9rem",
                margin: 3,
                border: "none",
              }}>
              {renderText(data?.corporateidentitystatus)}
            </CButton>
            <Tab
              label="CORPORATE IDENTITY VAIDATION"
              style={{ flex: 1, maxWidth: "50%" }}
              {...a11yProps(1)}
            />
            <CButton
              style={{
                marginTop: "10px",
                background: getBadge(data?.corporatedocumentinfostatus),
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "0.9rem",
                border: "none",
                margin: 3,
                border: "none",
              }}>
              {renderText(data?.corporatedocumentinfostatus)}
            </CButton>

            <Tab
              label="CORPORATE CONTACT"
              style={{ flex: 1, maxWidth: "50%" }}
              {...a11yProps(2)}
            />
            <CButton
              style={{
                marginTop: "10px",
                background: "transparent",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "0.9rem",
                margin: 3,
              }}>
              {renderText(data?.corporatecontactstatus)}
            </CButton>
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <CorporateInformation />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <CorporateIdentity />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <CorporateContact />
        </CustomTabPanel>
      </Box>
    </>
  );
}

const renderText = (info) => {
  let text = "";
  if (info === "not_submitted") {
    text = null;
  } else if (info === "pending") {
    text = "pending";
  } else if (info === "approved") {
    text = "approved";
  } else if (info === "rejected") {
    text = "rejected";
  }
  return text;
};
