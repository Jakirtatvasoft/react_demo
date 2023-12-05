import config from '../config.json' 
import authService from "./authService"
import http from "./httpService"

const apiEndpoint = config.apiEndpoint + 'users'

export const getRoles = () => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint + '/get-roles')
}

export const getUsers = () => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint)
}

export const addUser = (data) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint, data)
}

export const getUser = (userId) => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint + `/show/${userId}`)
}

export const editUser = (userId) => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint + `/${userId}`)
}

export const updateUser = (userId, data) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint + `/${userId}`, data)
}

export const changeUserStatus = (userId, data) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint + `/change-status/${userId}`, data)
}

export const deleteUser = (userId) => {
  http.setToken(authService.getToken())
  return http.delete(apiEndpoint + `/${userId}`)
}

export default {
  getRoles,
  getUsers,
  addUser,
  getUser,
  editUser,
  updateUser,
  changeUserStatus,
  deleteUser
}