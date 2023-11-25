import { CButton } from '@coreui/react'
import React, { useState } from 'react'
import { CSmartTable } from '@coreui/react-pro'
import { useDepartmentFetchingTransaction } from 'src/Hooks/fetchApiHooks'
import moment from 'moment'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Edit } from '@mui/icons-material'
import LockIcon from '@mui/icons-material/Lock'
import DeptModal from '../modals/department/DeptModal'
import axiosInstance from 'src/utils/newRequest'
import { decodeTokenFromStorage } from 'src/utils/storage'

const DepartmentTable = () => {
  const { data: usersData } = useDepartmentFetchingTransaction()
  const [openModals, setOpenModals] = useState({})
  const [visble, setVisible] = useState(false)
  const [department, setDepartment] = useState('')
  let user = decodeTokenFromStorage()
  const isProductOwner = user.roles.includes('product_owner') //false

  let columns = [
    {
      key: 'action',
      _style: { width: '2%' },
      label: '',
      filter: false,
      sorter: false,
    },
    {
      key: 'company',
      _style: { width: '20%' },
      filter: false,
    },
    {
      key: 'name',
      _style: { width: '20%' },
      filter: false,
    },
    {
      key: 'description',
      label: 'Description',
      _style: { width: '40%' },
      filter: false,
    },
    {
      key: 'active',
      label: 'Active',
      _style: { width: '20%' },
      filter: false,
    },
    {
      key: 'date',
      label: 'Date',
      _style: { width: '20%' },
      filter: false,
    },
  ]
  if (!isProductOwner) {
    // If the user is not a product owner, remove the 'company' column
    columns = columns.filter((column) => column.key !== 'company')
  }

  const getBadge = (status) => {
    switch (status) {
      case true:
        return 'success'
      case false:
        return 'secondary'
      default:
        return 'primary'
    }
  }

  const openModal = (index, itemId) => {
    setOpenModals((prevModals) => ({
      ...prevModals,
      [itemId]: prevModals[itemId] === index ? null : index,
    }))
  }

  const onEdit = (item) => {
    console.log(item)
    setVisible(true)
    setDepartment(item)
  }
  const changeStatus = async (item) => {
    let response =
      item && item?.active === true
        ? await axiosInstance.patch(`/deactivateDepartment/${item?.departmentid}`)
        : await axiosInstance.patch(`/activateDepartment/${item?.departmentid}`)
    try {
      if (response?.status === 200) {
        alert(response?.data?.message)
        window.location.reload()
      } else {
        alert('error updating resource')
      }
    } catch (error) {}
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
        onFilteredItemsChange={(items) => {
          console.log(items)
        }}
        onSelectedItemsChange={(items) => {
          console.log(items)
        }}
        scopedColumns={{
          action: (item, index) => {
            return (
              <td>
                <MoreVertIcon
                  onClick={() => openModal(index, item?.organizationid)}
                  style={{ cursor: 'pointer' }}
                />
                {openModals[item?.organizationid] !== null &&
                  openModals[item?.organizationid] === index && (
                    <div
                      style={{
                        backgroundColor: 'gray',
                        padding: '15px',
                        textAlign: 'center',
                        color: 'white',
                      }}
                    >
                      <div className="d-flex mb-3" onClick={() => changeStatus(item)}>
                        <LockIcon />
                        <h7>{item?.active === true ? 'Deactivate' : 'Activate'}</h7>
                      </div>
                      <div className="d-flex" onClick={() => onEdit(item)}>
                        <Edit />
                        <h7>Edit</h7>
                      </div>
                    </div>
                  )}
              </td>
            )
          },
          company: (item) => <td>{isProductOwner && <h7>{item?.user?.companyname}</h7>}</td>,
          name: (item) => (
            <td>
              <h7>{item.name}</h7>
            </td>
          ),
          description: (item) => (
            <td>
              <h7>{item.description}</h7>
            </td>
          ),
          active: (item) => (
            <td>
              <CButton style={{ width: '80%', textAlign: 'center' }} color={getBadge(item.active)}>
                {item.active ? 'active' : 'inactive'}
              </CButton>
            </td>
          ),
          date: (item) => (
            <td>
              <h8>{moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</h8>
            </td>
          ),
        }}
        sorterValue={{ column: 'status', state: 'asc' }}
        tableFilter
        tableProps={{
          className: 'add-this-class',
          responsive: true,
          striped: true,
          hover: true,
        }}
        tableBodyProps={{
          className: 'align-middle',
        }}
      />
      {visble && <DeptModal visible={visble} setVisible={setVisible} dept={department} />}
    </>
  )
}

export default DepartmentTable
