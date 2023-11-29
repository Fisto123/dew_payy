import { CButton } from "@coreui/react";
import React, { useState } from "react";
import { CSmartTable } from "@coreui/react-pro";
import moment from "moment";
import { decodeTokenFromStorage } from "src/utils/storage";
import { useAllDataUsers } from "src/Hooks/fetchApiHooks";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CorporateManagementTable = () => {
  let user = decodeTokenFromStorage();
  const { data } = useAllDataUsers();
  function removeDuplicatesById(array, idProperty) {
    const uniqueMap = new Map();
    array?.forEach((item) => {
      const itemId = item[idProperty];
      if (!uniqueMap.has(itemId)) {
        uniqueMap.set(itemId, item);
      }
    });

    // Convert the map values back to an array
    const uniqueArray = Array.from(uniqueMap.values());

    return uniqueArray;
  }
  let cleanedData = removeDuplicatesById(data, "organizationid");
  const nav = useNavigate();

  const isProductOwner = user.roles.includes("product_owner"); //false
  // Name	Information verification status	Document verification status	Contact verification status	created date
  let columns = [
    {
      key: "name",
      label: "name",
      _style: { width: "20%" },
      filter: false,
    },
    {
      key: "verificationstatus",
      label: "Information verification status",
      _style: { width: "20%" },
      filter: false,
    },
    {
      key: "documentstatus",
      label: "Document verification status",
      _style: { width: "20%" },
      filter: false,
    },
    {
      key: "contactstatus",
      label: "Contact verification status",
      _style: { width: "20%" },
      filter: false,
    },
    {
      key: "date",
      label: "Created date",
      _style: { width: "20%" },
      filter: false,
    },
  ];
  if (!isProductOwner) {
    // If the user is not a product owner, remove the 'company' column
    columns = columns.filter((column) => column.key !== "corporate");
  }
  const getBadge = (status) => {
    switch (status) {
      case "not_submitted":
        return "#ccc";
      case "pending":
        return "#FFD700";
      case "approved":
        return "#00FF00";
      case "rejected":
        return "#FF0000";
      default:
        return "#007BFF";
    }
  };

  const handleRowClick = (item) => {
    // Customize this path based on your application's route structure
    console.log(item);
    nav(`/corporate-management/corporate/${item?.organizationid}`);
  };
  console.log(data);
  return (
    <>
      <CSmartTable
        cleaner
        clickableRows={true}
        columns={columns}
        columnFilter
        columnSorter
        items={cleanedData || []}
        itemsPerPageSelect
        itemsPerPage={10}
        pagination
        onFilteredItemsChange={(items) => {}}
        onSelectedItemsChange={(items) => {
          alert("ddjfjf");
        }}
        onRowClick={handleRowClick}
        tableProps={{
          className: "add-this-class",
          responsive: true,
          striped: true,
          hover: true,
        }}
        scopedColumns={{
          name: (item) => (
            <td>
              <h7>{item?.companyname}</h7>
            </td>
          ),
          verificationstatus: (item) => (
            <td>
              <Button
                sx={{
                  width: "80%",
                  textAlign: "center",
                  color: "white",
                  backgroundColor: getBadge(item.corporateidentitystatus),
                }}>
                {item.corporateidentitystatus}
              </Button>
            </td>
          ),
          documentstatus: (item) => (
            <td>
              <Button
                sx={{
                  width: "80%",
                  textAlign: "center",
                  color: "white",
                  backgroundColor: getBadge(item.corporateidentitystatus),
                }}>
                {item.corporatedocumentinfostatus}
              </Button>
            </td>
          ),
          contactstatus: (item) => (
            <td>
              <Button
                sx={{
                  width: "80%",
                  textAlign: "center",
                  color: "white",
                  backgroundColor: getBadge(item.corporateidentitystatus),
                }}>
                {item.corporatecontactstatus}
              </Button>
            </td>
          ),
          date: (item) => (
            <td>
              <h8>{item?.createdAt}</h8>
            </td>
          ),
        }}
        sorterValue={{ column: "status", state: "asc" }}
        tableFilter
        tableBodyProps={{
          className: "align-middle",
        }}
      />
    </>
  );
};

export default CorporateManagementTable;
