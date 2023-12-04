import { CButton } from "@coreui/react";
import React, { useState } from "react";
import InvoiceModal from "src/components/modals/transactions/InvoiceModal";
import TransactionTable from "src/components/tables/TransactionTable";
import UserTable from "src/components/tables/UserTable";

const Transactions = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="d-flex  justify-content-end ">
        <CButton onClick={() => setVisible(!visible)} color="primary">
          Add bill
        </CButton>
      </div>
      <TransactionTable />
      {visible && <InvoiceModal visible={visible} setVisible={setVisible} />}
    </div>
  );
};

export default Transactions;
