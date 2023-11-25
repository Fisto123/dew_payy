import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CButton, CForm, CFormInput, CFormFeedback, CFormLabel } from '@coreui/react'
import axiosInstance from 'src/utils/newRequest'
import { Checkbox, FormControlLabel } from '@mui/material'
import { useDataCorporates } from 'src/Hooks/fetchApiHooks'
import { decodeTokenFromStorage } from 'src/utils/storage'
import { BASEURL } from 'src/utils/constant'

const UsersModal = ({ visible, setVisible, user }) => {
  console.log(user)
  const nav = useNavigate()
  const { data: corpdata } = useDataCorporates()
  let info = decodeTokenFromStorage()
  let ownerspermission = info && info?.roles.includes('product_owner')
  const [orgdept, setOrgDept] = useState([])
  const [formValues, setFormValues] = useState({
    firstname: '',
    surname: '',
    email: '',
    department: '',
    orgid: ownerspermission ? '' : info.orgid,
    roles: user?.roles || [],
  })
  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }))
  }
  console.log(formValues)
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target

    setFormValues((prevValues) => {
      if (checked && !prevValues.roles.includes(value)) {
        return {
          ...prevValues,
          roles: [...prevValues.roles, value],
        }
      } else if (!checked) {
        return {
          ...prevValues,
          roles: prevValues.roles.filter((role) => role !== value),
        }
      } else {
        // No change needed
        return prevValues
      }
    })
  }
  useEffect(() => {
    if (user) {
      setFormValues({
        firstname: user?.firstname || '',
        surname: user?.surname || '',
        email: user?.email || '',
        department: user?.department || 'ff',
        roles: user?.roles || [],
        // orgid: orgdept[0]?.organizationid,
      })
    }
  }, [user])
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get(
          `${BASEURL}/searchorgdept/${user?.organizationid || formValues?.orgid}`,
        )
        setOrgDept(response.data)
      } catch (error) {
        console.log(error)
      } finally {
      }
    }
    fetchDepartments()
  }, [formValues.orgid, user?.organizationid])

  const BrowserDefaults = () => {
    const [validated, setValidated] = useState(false)
    const handleSubmit = async (event) => {
      const form = event.currentTarget
      console.log(form)
      event.preventDefault()

      if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        setValidated(true)
        try {
          const orgid = decodeTokenFromStorage().orgid
          const response =
            orgid && user && user?.userid
              ? await axiosInstance.patch(`/edituser/${user?.userid}`, formValues)
              : orgid && (await axiosInstance.post(`/adduser`, formValues))
          if (response.status === 201) {
            nav('/')
            alert(response.data.message)
          }
        } catch (error) {
          let logs = error.response.data.errors
          logs?.forEach((error) => {
            alert(`${error.field}: ${error.message}`)
          }) || alert(error.response.data.error)
        }
      }
    }

    const isFormValid = () => {
      const requiredFieldsFilled = Object.values(formValues).every((value) => value !== '')
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)
      const atLeastOneCheckboxChecked = formValues.roles.length > 0

      return requiredFieldsFilled && emailValid && atLeastOneCheckboxChecked
    }
    console.log(isFormValid())
    return (
      <>
        <CModal
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="LiveDemoExampleLabel"
        >
          <CModalHeader onClose={() => setVisible(false)}>
            <CModalTitle id="LiveDemoExampleLabel">
              {user && user.userid ? 'EDIT USER' : 'ADD USER'}
            </CModalTitle>
          </CModalHeader>
          <CForm
            className="row g-4 needs-validation p-3"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
          >
            {ownerspermission && (
              <CCol md={12} className="position-relative">
                <CFormLabel htmlFor="validationTooltip04">Corporates</CFormLabel>
                <CFormSelect
                  onChange={handleChange}
                  id="validationTooltip04"
                  required
                  name="orgid"
                  disabled={user && user.userid}
                  // defaultChecked={dept && dept.departmentid ? deptValues.orgid : 'ww'}
                >
                  <option selected disabled>
                    Choose...
                  </option>
                  {corpdata &&
                    corpdata.map((dat, index) => (
                      <option key={index} value={dat?.organizationid}>
                        {dat?.companyname}
                      </option>
                    ))}
                </CFormSelect>
                <CFormFeedback tooltip invalid>
                  Please provide a valid department.
                </CFormFeedback>
              </CCol>
            )}

            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor="validationTooltip01">Firstname</CFormLabel>
              <CFormInput
                type="text"
                id="validationTooltip01"
                required
                style={{ height: '50px' }}
                onChange={handleChange}
                defaultValue={user && user?.firstname ? user?.firstname : ''}
                name="firstname"
              />
              <CFormFeedback tooltip invalid style={{ background: 'none', color: 'red' }}>
                Please input your firstname.
              </CFormFeedback>
            </CCol>
            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor="validationTooltip02">Lastname</CFormLabel>
              <CFormInput
                defaultValue={user && user?.surname ? user?.surname : ''}
                onChange={handleChange}
                name="surname"
                type="text"
                id="validationTooltip02"
                style={{ height: '50px' }}
                required
              />
              <CFormFeedback tooltip invalid style={{ background: 'none', color: 'red' }}>
                Please input your lastname.
              </CFormFeedback>
            </CCol>
            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor="validationTooltip03">Email</CFormLabel>
              <CFormInput
                onChange={handleChange}
                name="email"
                type="email"
                defaultValue={user && user?.email ? user?.email : ''}
                id="validationTooltip03"
                required
              />
              <CFormFeedback tooltip invalid style={{ background: 'none', color: 'red' }}>
                Please provide a valid email.
              </CFormFeedback>
            </CCol>
            <CCol md={6} className="position-relative">
              <CFormLabel htmlFor="validationTooltip04">Department</CFormLabel>
              <CFormSelect
                onChange={handleChange}
                id="validationTooltip04"
                required
                name="department"
                defaultValue={user && user?.department ? user?.department : ''}
              >
                <option selected disabled>
                  Choose...
                </option>
                {orgdept && orgdept.map((dat, index) => <option key={index}>{dat.name}</option>)}
              </CFormSelect>
              <CFormFeedback tooltip invalid>
                Please provide a valid department.
              </CFormFeedback>
            </CCol>

            <CCol xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.roles.includes('biller_agent')}
                    value="biller_agent"
                    onChange={handleCheckboxChange}
                  />
                }
                label="Assign biller agent role"
              />
            </CCol>
            <CCol xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.roles.includes('dashboard_agent')}
                    value="dashboard_agent"
                    onChange={handleCheckboxChange}
                  />
                }
                label="Assign dashboard agent role"
              />
            </CCol>
            <CCol xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.roles.includes('terminal_agent')}
                    value="terminal_agent"
                    onChange={handleCheckboxChange}
                  />
                }
                label="Assign terminal agent role"
              />
            </CCol>
            <CCol xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.roles.includes('corporate_owner')}
                    value="corporate_owner"
                    onChange={handleCheckboxChange}
                  />
                }
                label="Assign corporate agent role"
              />
            </CCol>
            <CCol xs={12} className="position-relative">
              <CButton color="primary" type="submit" disabled={!isFormValid()}>
                Submit form
              </CButton>
            </CCol>
          </CForm>
        </CModal>
      </>
    )
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
        }}
      >
        <CCol xs={12} md={10}>
          <CCard className="mb-4">
            <h4 className="p-3 d-flex justify-content-center text-uppercase fw-bolder">
              Register Corporate
            </h4>
            <h7 className="p-3 d-flex justify-content-center">
              Register new corporate to start enjoying dew pay payments solution
            </h7>
            <CCardBody>{BrowserDefaults()}</CCardBody>
          </CCard>
        </CCol>
      </CContainer>
    </div>
  )
}
UsersModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.bool.isRequired,
  user: PropTypes.object,
}
export default UsersModal
