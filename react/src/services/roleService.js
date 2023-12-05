import config from '../config.json'
import authService from './authService'
import http from './httpService'

const apiEndpoint = config.apiEndpoint + 'roles'

export const getRoles = () => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint)
}

export const addRole = (data) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint, data)
}

export const changeRoleStatus = (roleId, data) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint + `/change-status/${roleId}`, data)
}

export const getRole = (roleId) => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint + `/${roleId}`)
}

export const updateRole = (roleId, data) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint + `/${roleId}`, data)
}

export const deleteRole = (roleId) => {
  http.setToken(authService.getToken())
  return http.delete(apiEndpoint + `/${roleId}`)
}

export default {
  getRoles,
  addRole,
  getRole,
  updateRole,
  changeRoleStatus,
  deleteRole
}