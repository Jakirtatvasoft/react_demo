import config from '../config.json'
import authService from './authService'
import http from './httpService'

const apiEndpoint = config.apiEndpoint + 'roles'

export const getRoles = () => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint)
}

export const addRole = (data: FormData) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint, data)
}

export const changeRoleStatus = (roleId: number, data: FormData) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint + `/change-status/${roleId}`, data)
}

export const getRole = (roleId: number | string) => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint + `/${roleId}`)
}

export const updateRole = (roleId: number | string, data: FormData) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint + `/${roleId}`, data)
}

export const deleteRole = (roleId: number) => {
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