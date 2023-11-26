import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import BillerManagerTable from "src/components/tables/BillerManagerTable";
import BillerCodeManagement from "src/components/tables/BillerCodeManagement";
import { CButton } from "@coreui/react";
import Addbillmodal from "src/components/modals/biller/Addbillmodal";

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

export default function BillerManagement() {
  const [value, setValue] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="d-flex  justify-content-end ">
        <CButton onClick={() => setVisible(!visible)} color="primary">
          ADD NEW BILL CODE
        </CButton>
      </div>
      {visible && <Addbillmodal visible={visible} setVisible={setVisible} />}
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example">
            <Tab
              label="BILLER CODE MANAGEMENT"
              style={{ flex: 1, maxWidth: "50%" }}
              {...a11yProps(0)}
            />
            <Tab
              label="BILLER MANAGERS"
              style={{ flex: 1, maxWidth: "50%" }}
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <BillerCodeManagement />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <BillerManagerTable />
        </CustomTabPanel>
      </Box>
    </>
  );
}
