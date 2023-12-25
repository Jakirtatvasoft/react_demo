import config from '../config.json' 
import authService from "./authService"
import http from "./httpService"

const apiEndpoint = config.apiEndpoint + 'events'

export const getEvents = () => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint)
}

export const addEvent = (data: FormData) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint, data)
}

export const editEvent = (eventId: number | string) => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint + `/${eventId}`)
}

export const updateEvent = (eventId: number | string, data: FormData) => {
  http.setToken(authService.getToken())
  return http.post(apiEndpoint + `/${eventId}`, data)
}

export const deleteEvent = (eventId: number | string) => {
  http.setToken(authService.getToken())
  return http.delete(apiEndpoint + `/${eventId}`)
}

export const getCalenderEvents = () => {
    http.setToken(authService.getToken())
    return http.get(apiEndpoint + `/calender/events`)
  }

export default {
    getEvents,
    addEvent,
    editEvent,
    updateEvent,
    deleteEvent,
    getCalenderEvents
}