import { jwtDecode } from 'jwt-decode'

export const setToken = (token) => {
  localStorage.setItem('tokenkey', token)
}

export const getToken = () => {
  return localStorage.getItem('tokenkey')
}

export const clearToken = () => {
  localStorage.removeItem('tokenkey')
}
export const decodeTokenFromStorage = () => {
  const token = getToken()
  return token && jwtDecode(token)
}
// export const decodeActivationToken = (token) => {
//   return token && decodeToken(token)
// }
export const hasTokenExpired = () => {
  let hasExpired
  let jwt = getToken()
  const base64Url = jwt && jwt.split('.')[1]
  const base64 = base64Url && base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const payload = JSON.parse(atob(base64))

  const expirationTime = payload && payload.exp // Expiration time in UNIX timestamp
  const currentTime = Math.floor(Date.now() / 1000) // Current time in UNIX timestamp

  const remainingTimeInSeconds = expirationTime - currentTime

  if (remainingTimeInSeconds > 0) {
    hasExpired = false
  } else {
    hasExpired = true
  }
  return hasExpired
}
