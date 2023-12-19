import { CurrentUserDataType, LocalStorageUserInfoDataType, UserDataType } from '../Types'
import { USER_INFO, USER_TOKEN } from '../common/constant'
import { decryptData, encryptData } from '../common/cryptoHelpers'
import config from '../config.json'
import http from './httpService'

const apiEndpoint = config.apiEndpoint

export const login = (data: FormData) => {
  let apiURL = apiEndpoint + 'login'

  return http.post(apiURL, data)
}

export const updateProfile = (userId: number, data: FormData) => {
  http.setToken(getToken())
  return http.post(apiEndpoint + `edit-profile/${userId}`, data)
}

export const logout = () => {
  let apiURL = ''

  http.setToken(getToken())  
  apiURL = apiEndpoint + 'logout'

  return http.post(apiURL)
}

export const setCurrentUser = (data: CurrentUserDataType) => {
  localStorage.setItem(USER_INFO, encryptData(JSON.stringify(data.user)))
  if (data.token) {
    localStorage.setItem(USER_TOKEN, data.token)
  }
}

export const getCurrentUser = (): UserDataType => {
  const storedData = localStorage.getItem(USER_INFO);

  if (storedData !== null) {
    const data: LocalStorageUserInfoDataType = JSON.parse(storedData);
    return decryptData(data);
  }

  return {} as UserDataType
}

export const getImage = (user: UserDataType) => {
  if (user.files.length > 0 && user.files[0]) {
    return user.files[0].path
  }

  return null
}

export const checkUserPermission = (permission: string) => {
  let user = getCurrentUser()
  
  if (user?.role?.role_permissions?.includes(permission)) {
    return true
  }

  return false
}

export const getToken = () => {
  return localStorage.getItem(USER_TOKEN) || ''
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