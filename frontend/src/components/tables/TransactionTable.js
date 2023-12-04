import { CButton } from "@coreui/react";
import React, { useState } from "react";
import { CSmartTable } from "@coreui/react-pro";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Edit } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import axiosInstance from "src/utils/newRequest";
import { useGetInvoices } from "src/Hooks/fetchApiHooks";
import UsersModal from "../modals/users/UsersModal";
import { decodeTokenFromStorage } from "src/utils/storage";
import { formatCurrency } from "src/utils/currency";
import { InvoiceDetails } from "../modals/transactions/InvoiceDetail";
const TransactionTable = () => {
  const [openModals, setOpenModals] = useState({});
  const [visble, setVisible] = useState(false);
  const [transaction, setTransaction] = useState("");
  let user = decodeTokenFromStorage();
  let isProductOwner = user.roles.includes("product_owner");
  const orgid = user?.orgid;
  const { data: usersData } = useGetInvoices(orgid);
  let columns = [
    {
      key: "action",
      _style: { width: "2%" },
      label: "",
      filter: false,
      sorter: false,
    },
    {
      key: "refcode",
      label: "reference",
      _style: { width: "20%" },
      filter: false,
    },
    {
      key: "user",
      _style: { width: "20%" },
      filter: false,
    },
    {
      key: "total_amount",
      label: "total amount",
      _style: { width: "10%" },
      filter: false,
    },
    {
      key: "amount_paid",
      label: "amount paid",
      _style: { width: "10%" },
      filter: false,
    },
    {
      key: "status",
      label: "status",
      _style: { width: "10%" },
      filter: false,
    },
    {
      key: "date",
      label: "created date",
      _style: { width: "20%" },
      filter: false,
    },
  ];
  if (!isProductOwner) {
    columns = columns.filter((column) => column.key !== "organization");
  }
  const getBadge = (status) => {
    switch (status) {
      case "pending":
        return "secondary";
      case false:
        return "completed";
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      default:
        return "primary";
    }
  };
  const onView = (item) => {
    setVisible(true);
    setTransaction(item);
  };
  const openModal = (index, itemId) => {
    setOpenModals((prevModals) => ({
      ...prevModals,
      [itemId]: prevModals[itemId] === index ? null : index,
    }));
  };
  console.log(transaction);
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
        onSelectedItemsChange={(items) => {
          alert("hi");
        }}
        scopedColumns={{
          action: (item, index) => {
            return (
              <td>
                <MoreVertIcon
                  onClick={() => openModal(index, item?.organizationid)}
                  style={{ cursor: "pointer" }}
                />
                {openModals[item?.organizationid] !== null &&
                  openModals[item?.organizationid] === index && (
                    <div
                      style={{
                        backgroundColor: "gray",
                        padding: "15px",
                        textAlign: "center",
                        color: "white",
                      }}>
                      <div className="d-flex" onClick={() => onView(item)}>
                        <Edit />
                        <h7>View</h7>
                      </div>
                    </div>
                  )}
              </td>
            );
          },
          refcode: (item) => (
            <td>
              <h7>{item?.invoiceid}</h7>
            </td>
          ),
          user: (item) => (
            <td>
              <h7>{item?.customerfirstname + " " + item?.customerlastname}</h7>
            </td>
          ),
          total_amount: (item) => (
            <td>
              <h7>{formatCurrency(item?.totalAmount, "NGN", "en-NG")}</h7>
            </td>
          ),
          amount_paid: (item) => (
            <td>{formatCurrency(item?.amountpaid, "NGN", "en-NG")}</td>
          ),
          status: (item) => (
            <td>
              <CButton
                style={{ width: "100%", textAlign: "center", color: "white" }}
                color={getBadge(item.status)}>
                {item.status}
              </CButton>
            </td>
          ),
          date: (item) => (
            <td>
              <h9>{moment(item.createdAt).format("MMMM YYYY, h:mm:ss a")}</h9>
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
      {transaction && (
        <InvoiceDetails
          visible={visble}
          setVisible={setVisible}
          transaction={transaction}
        />
      )}
    </>
  );
};

export default TransactionTable;
