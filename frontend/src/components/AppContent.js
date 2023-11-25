import React, { Suspense, useEffect } from 'react'
import { Navigate, useNavigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '../routes'
import { clearToken, hasTokenExpired } from 'src/utils/storage'

const AppContent = () => {
  let nav = useNavigate()
  const tokenexpired = hasTokenExpired()
  useEffect(() => {
    tokenexpired && nav('/login') && clearToken()
  }, [nav, tokenexpired])
  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
