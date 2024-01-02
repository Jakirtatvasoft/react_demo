import config from '../config.json' 
import authService from "./authService"
import http from "./httpService"

const apiEndpoint = config.apiEndpoint + 'task_columns'

export const addTaskColumn = (data: FormData) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint, data)
}

export const deleteColumn = (columnId: number | string) => {
  http.setToken(authService.getToken())
  return http.delete(apiEndpoint + `/${columnId}`)
}

export const editColumn = (columnId: number | string) => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint + `/${columnId}`)
}

export const updateColumn = (columnId: number | string, data: FormData) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint + `/${columnId}`, data)
}

export default {
    addTaskColumn,
    deleteColumn,
    editColumn,
    updateColumn
}