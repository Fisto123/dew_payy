import { CButton } from "@coreui/react";
import React, { useState } from "react";
import { CSmartTable } from "@coreui/react-pro";
import { useDepartmentBillers } from "src/Hooks/fetchApiHooks";
import moment from "moment";
import { decodeTokenFromStorage } from "src/utils/storage";

const BillerManagerTable = () => {
  let user = decodeTokenFromStorage();
  const { data: usersData } = useDepartmentBillers();

  const isProductOwner = user.roles.includes("product_owner"); //false

  let columns = [
    {
      key: "corporate",
      _style: { width: "30%" },
      filter: false,
    },
    {
      key: "fullname",
      label: "fullname",
      _style: { width: "20%" },
      filter: false,
    },
    {
      key: "email",
      label: "email",
      _style: { width: "40%" },
      filter: false,
    },
    {
      key: "department",
      label: "department",
      _style: { width: "20%" },
      filter: false,
    },
  ];
  if (!isProductOwner) {
    // If the user is not a product owner, remove the 'company' column
    columns = columns.filter((column) => column.key !== "corporate");
  }

  return (
    <>
      <CSmartTable
        cleaner
        clickableRows
        columns={columns}
        columnFilter
        columnSorter
        items={usersData || []}
        itemsPerPageSelect
        itemsPerPage={10}
        pagination
        onFilteredItemsChange={(items) => {}}
        onSelectedItemsChange={(items) => {}}
        scopedColumns={{
          corporate: (item) => (
            <td>{isProductOwner && <h7>{item?.companyname}</h7>}</td>
          ),
          fullname: (item) => (
            <td>
              <h7>{item?.firstname + " " + item?.surname}</h7>
            </td>
          ),
          email: (item) => (
            <td>
              <h7>{item.email}</h7>
            </td>
          ),
          department: (item) => (
            <td>
              <h8>{item?.department}</h8>
            </td>
          ),
        }}
        sorterValue={{ column: "status", state: "asc" }}
        tableFilter
        tableProps={{
          className: "add-this-class",
          responsive: true,
          striped: true,
          hover: true,
        }}
        tableBodyProps={{
          className: "align-middle",
        }}
      />
    </>
  );
};

export default BillerManagerTable;
