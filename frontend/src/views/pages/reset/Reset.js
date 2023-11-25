import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'
import axiosInstance from 'src/utils/newRequest'

const Reset = () => {
  const nav = useNavigate()
  let { actcode } = useParams()
  const [resetValues, setResetValues] = useState({
    password: '',
    actcode,
  })
  const handleChange = (event) => {
    const { name, value } = event.target
    setResetValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }

  const activateToken = async () => {
    try {
      const response = actcode && (await axiosInstance.patch(`/activateuser/${actcode}`))
      if (response && response?.data?.message) {
        alert(response?.data?.message)
      }
    } catch (error) {
      if (error) {
        alert(error?.response?.data?.message)
      }
    }
  }
  console.log(resetValues)
  useEffect(() => {
    activateToken()
  })
  const handlereset = async (e) => {
    e.preventDefault()

    try {
      const response = await axiosInstance.patch(`/resetpassword`, resetValues)
      if (response.status === 200) {
        alert(response.data.message)
        nav('/login')
      }
    } catch (error) {
      console.log(error)
      let logs = error.response.data.errors
      logs?.forEach((error) => {
        alert(`${error.field}: ${error.message}`)
      }) || alert(error.response.data.message)
    }
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handlereset}>
                    <h1>Reset</h1>
                    <p className="text-medium-emphasis">Reset password</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="password"
                        onChange={handleChange}
                        type="text"
                        name="password"
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          disabled={!resetValues?.password}
                          type="submit"
                        >
                          Reset Password
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      If you dont have an account, please register. By signing in you agree to our
                      Terms of Service.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Reset
