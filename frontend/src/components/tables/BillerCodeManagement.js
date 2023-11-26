import { CButton } from "@coreui/react";
import React, { useState } from "react";
import { CSmartTable } from "@coreui/react-pro";
import {
  useDepartmentBillers,
  useGetOrganizationBiller,
} from "src/Hooks/fetchApiHooks";
import { Edit } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import moment from "moment";
import { decodeTokenFromStorage } from "src/utils/storage";
import { formatCurrency } from "src/utils/currency";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Addbillmodal from "../modals/biller/Addbillmodal";
import axiosInstance from "src/utils/newRequest";

const BillerCodeManagement = () => {
  const [openModals, setOpenModals] = useState({});
  const [visble, setVisible] = useState(false);
  const [biller, setBiller] = useState("");
  let user = decodeTokenFromStorage();
  const { data: usersData } = useGetOrganizationBiller();
  const isProductOwner = user?.roles?.includes("product_owner"); //false
  const openModal = (index, itemId) => {
    setOpenModals((prevModals) => ({
      ...prevModals,
      [itemId]: prevModals[itemId] === index ? null : index,
    }));
  };

  const onEdit = (item) => {
    setVisible(true);
    setBiller(item);
  };
  const changeStatus = async (item) => {
    let response =
      item && item?.active === true
        ? await axiosInstance.patch(`/deactivatebiller/${item?.billerid}`)
        : await axiosInstance.patch(`/activatebiller/${item?.billerid}`);
    try {
      if (response?.status === 200) {
        alert(response?.data?.message);
        window.location.reload();
      } else {
        alert("error updating resource");
      }
    } catch (error) {}
  };
  let columns = [
    {
      key: "action",
      _style: { width: "2%" },
      label: "",
      filter: false,
      sorter: false,
    },
    {
      key: "corporate",
      _style: { width: "30%" },
      filter: false,
    },
    {
      key: "department",
      label: "department",
      _style: { width: "15%" },
      filter: false,
    },
    {
      key: "code",
      label: "code",
      _style: { width: "10%" },
      filter: false,
    },
    {
      key: "description",
      label: "description",
      _style: { width: "25%" },
      filter: false,
    },
    {
      key: "amount",
      label: "Amount(₦)",
      _style: { width: "20%" },
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
      label: "date",
      _style: { width: "30%" },
      filter: false,
    },
  ];
  if (!isProductOwner) {
    // If the user is not a product owner, remove the 'company' column
    columns = columns.filter((column) => column.key !== "corporate");
  }
  const getBadge = (status) => {
    switch (status) {
      case true:
        return "success";
      case false:
        return "secondary";
      default:
        return "primary";
    }
  };

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
                      <div
                        className="d-flex mb-3"
                        onClick={() => changeStatus(item)}>
                        <LockIcon />
                        <h7>
                          {item?.active === true ? "Deactivate" : "Activate"}
                        </h7>
                      </div>
                      <div className="d-flex" onClick={() => onEdit(item)}>
                        <Edit />
                        <h7>Edit</h7>
                      </div>
                    </div>
                  )}
              </td>
            );
          },
          corporate: (item) => (
            <td>
              {isProductOwner && <h7>{item?.organization?.companyname}</h7>}
            </td>
          ),
          department: (item) => (
            <td>
              <h7>{item?.department?.name}</h7>
            </td>
          ),
          code: (item) => (
            <td>
              <h7>{item.billcode}</h7>
            </td>
          ),
          description: (item) => (
            <td>
              <h8>{item?.billdescription}</h8>
            </td>
          ),
          amount: (item) => (
            <td>
              <h8> {formatCurrency(item?.amount, "NGN", "en-NG")}</h8>
            </td>
          ),
          status: (item) => (
            <td>
              <CButton
                style={{ width: "80%", textAlign: "center" }}
                color={getBadge(item.active)}>
                {item.active ? "active" : "inactive"}
              </CButton>
            </td>
          ),
          date: (item) => (
            <td>
              <h8>
                {moment(item.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
              </h8>
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
      {visble && (
        <Addbillmodal visible={visble} setVisible={setVisible} bill={biller} />
      )}
    </>
  );
};

export default BillerCodeManagement;
