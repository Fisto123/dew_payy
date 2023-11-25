import { CButton } from '@coreui/react'
import React, { useState } from 'react'
import UsersModal from 'src/components/modals/users/UsersModal'
import UserTable from 'src/components/tables/UserTable'

const UserManagement = () => {
  const [visible, setVisible] = useState(false)

  return (
    <div>
      <div className="d-flex  justify-content-end ">
        <CButton onClick={() => setVisible(!visible)} color="primary">
          Add user
        </CButton>
      </div>
      <UserTable />
      {visible && <UsersModal visible={visible} setVisible={setVisible} />}
    </div>
  )
}

export default UserManagement
