import { CButton } from '@coreui/react'
import React, { useState } from 'react'
import DeptModal from 'src/components/modals/department/DeptModal'
import DepartmentTable from 'src/components/tables/DepartmentTable'

const Department = () => {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <div className="d-flex  justify-content-end ">
        <CButton onClick={() => setVisible(!visible)} color="primary">
          Add department
        </CButton>
      </div>
      <DepartmentTable />
      {visible && <DeptModal visible={visible} setVisible={setVisible} />}
    </div>
  )
}

export default Department
