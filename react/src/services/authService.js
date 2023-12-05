import { USER_INFO, USER_TOKEN } from '../common/constant'
import { decryptData, encryptData } from '../common/cryptoHelpers'
import config from '../config.json'
import http from './httpService'

const apiEndpoint = config.apiEndpoint

export const login = (data) => {
  let apiURL = apiEndpoint + 'login'

  return http.post(apiURL, data)
}

export const updateProfile = (userId, data) => {
  http.setToken(getToken())
  return http.post(apiEndpoint + `edit-profile/${userId}`, data)
}

export const logout = () => {
  let apiURL = ''

  http.setToken(getToken())  
  apiURL = apiEndpoint + 'logout'

  return http.post(apiURL)
}

export const setCurrentUser = (data) => {
  localStorage.setItem(USER_INFO, encryptData(JSON.stringify(data.user)))
  if (data.token) {
    localStorage.setItem(USER_TOKEN, data.token)
  }
}

export const getCurrentUser = () => {
  const storedData = localStorage.getItem(USER_INFO);

  if (storedData !== null) {
    const data = JSON.parse(storedData);
    return decryptData(data);
  }

  return null
}

export const getImage = (user) => {
  // let user = getCurrentUser()
  
  if (user.files.length > 0) {
    return user.files[0].path
  }

  return null
}

export const checkUserPermission = (permission) => {
  let user = getCurrentUser()
  
  if (user.role.role_permissions.includes(permission)) {
    return true
  }

  return false
}

export const getToken = () => {
  return localStorage.getItem(USER_TOKEN)
}

export default {
  login,
  updateProfile,
  logout,
  setCurrentUser,
  getCurrentUser,
  getImage,
  checkUserPermission,
  getToken
}