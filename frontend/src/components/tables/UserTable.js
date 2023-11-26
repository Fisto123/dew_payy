import { CButton } from "@coreui/react";
import React, { useState } from "react";
import { CSmartTable } from "@coreui/react-pro";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Edit } from "@mui/icons-material";
import LockIcon from "@mui/icons-material/Lock";
import axiosInstance from "src/utils/newRequest";
import { useUsersFetchingTransaction } from "src/Hooks/fetchApiHooks";
import UsersModal from "../modals/users/UsersModal";
import { decodeTokenFromStorage } from "src/utils/storage";

const UserTable = () => {
  const { data: usersData } = useUsersFetchingTransaction();
  const [openModals, setOpenModals] = useState({});
  const [visble, setVisible] = useState(false);
  const [userz, setUser] = useState("");
  let user = decodeTokenFromStorage();
  let isProductOwner = user.roles.includes("product_owner");

  let columns = [
    {
      key: "action",
      _style: { width: "2%" },
      label: "",
      filter: false,
      sorter: false,
    },
    {
      key: "organization",
      _style: { width: "20%" },
      filter: false,
    },
    {
      key: "user",
      _style: { width: "20%" },
      filter: false,
    },
    {
      key: "department",
      label: "department",
      _style: { width: "20%" },
      filter: false,
    },
    {
      key: "password_changed",
      label: "password changed",
      _style: { width: "20%" },
      filter: false,
    },
    {
      key: "verified",
      label: "verified",
      _style: { width: "13%" },
      filter: false,
    },
    {
      key: "status",
      label: "Status",
      _style: { width: "20%" },
      filter: false,
    },
    {
      key: "date",
      label: "Date",
      _style: { width: "20%" },
      filter: false,
    },
  ];
  if (!isProductOwner) {
    columns = columns.filter((column) => column.key !== "organization");
  }
  const getBadge = (status) => {
    switch (status) {
      case true:
        return "success";
      case false:
        return "secondary";
      case "active":
        return "success";
      case "inactive":
        return "secondary";
      default:
        return "primary";
    }
  };

  const openModal = (index, itemId) => {
    setOpenModals((prevModals) => ({
      ...prevModals,
      [itemId]: prevModals[itemId] === index ? null : index,
    }));
  };

  const onEdit = (item) => {
    setVisible(true);
    setUser(item);
  };
  const changeStatus = async (item) => {
    let response =
      item && item?.status === "inactive"
        ? await axiosInstance.patch(`/activateuserstatus/${item?.userid}`)
        : await axiosInstance.patch(`/deactivateuserstatus/${item?.userid}`);
    try {
      if (response?.status === 200) {
        alert(response?.data?.message);
        window.location.reload();
      } else {
        alert("error updating resource");
      }
    } catch (error) {}
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
                          {item?.status === "active"
                            ? "Deactivate"
                            : "Activate"}
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
          organization: (item) => (
            <td>
              <h7>{item?.companyname}</h7>
            </td>
          ),
          user: (item) => (
            <td>
              <h7>
                {item?.firstname +
                  " " +
                  item?.surname +
                  " " +
                  "/" +
                  item?.email}
              </h7>
            </td>
          ),
          department: (item) => (
            <td>
              <h7>{item.department || "N/S"}</h7>
            </td>
          ),
          password_changed: (item) => (
            <td>
              <CButton
                style={{ width: "80%", textAlign: "center" }}
                color={getBadge(item.passwordchanged)}>
                {item.passwordchanged ? "yes" : "no"}
              </CButton>
            </td>
          ),
          verified: (item) => (
            <td>
              {" "}
              <CButton
                style={{ width: "80%", textAlign: "center" }}
                color={getBadge(item.accountactivated)}>
                {item.accountactivated ? "yes" : "no"}
              </CButton>
            </td>
          ),
          status: (item) => (
            <td>
              {" "}
              <CButton
                style={{ width: "80%", textAlign: "center" }}
                color={getBadge(item.status)}>
                {item.status === "active" ? "yes" : "no"}
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
      {visble && (
        <UsersModal visible={visble} setVisible={setVisible} user={userz} />
      )}
    </>
  );
};

export default UserTable;
