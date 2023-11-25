import React from 'react'
import { Navigate } from 'react-router-dom'
import { getToken } from './storage'
import PropTypes from 'prop-types'

function PrivateRoute({ children }) {
  let isTokenAvailable = getToken()

  if (!isTokenAvailable) {
    return <Navigate to="/login" replace />
  }
  return children
}
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PrivateRoute
