import { PermissionFormdataType } from '../Types'
import config from '../config.json'
import authService from "./authService"
import http from "./httpService"

const apiEndpoint = config.apiEndpoint + 'role-permission'

export const getRoles = () => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint)
}

export const addRolesPermissions = (data: PermissionFormdataType) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint, data)
}

export default {
  getRoles,
  addRolesPermissions
}