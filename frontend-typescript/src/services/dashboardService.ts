import config from '../config.json'
import http from './httpService'
import authService from './authService'

const apiEndpoint = config.apiEndpoint + 'dashboard'

const getDashboardData = () => {
  http.setToken(authService.getToken())
  return http.get(apiEndpoint)
}

export default {
  getDashboardData
}