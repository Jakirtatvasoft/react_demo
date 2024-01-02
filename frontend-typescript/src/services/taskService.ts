import config from '../config.json' 
import authService from "./authService"
import http from "./httpService"

const apiEndpoint = config.apiEndpoint + 'tasks'

export const addTask = (data: FormData) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint, data)
}

export const getColumns = () => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint + '/get-columns')
}

export const getBoard = () => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint + '/board')
}

export const deleteTask = (taskId: number | string) => {
  http.setToken(authService.getToken())
  return http.delete(apiEndpoint + `/${taskId}`)
}

export const getBoardReOrder = (data: FormData) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint + '/reorder', data)
}

export const editTask = (taskId: number | string) => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint + `/${taskId}`)
}

export const updateTask = (taskId: number | string, data: FormData) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint + `/${taskId}`, data)
}

export default {
    addTask,
    getColumns,
    getBoard,
    deleteTask,
    getBoardReOrder,
    editTask,
    updateTask
}