import { CButton } from "@coreui/react";
import React, { useState } from "react";
import UsersModal from "src/components/modals/users/UsersModal";
import CorporateManagementTable from "src/components/tables/CorporateManagementTable";
import UserTable from "src/components/tables/UserTable";

const CorporateManagement = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <CorporateManagementTable />
    </div>
  );
};

export default CorporateManagement;
