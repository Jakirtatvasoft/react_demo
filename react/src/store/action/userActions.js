import { GET_CURRENT_USER, SET_CURRENT_USER } from "../../common/constant"

export const setCurrentUserState = (user) => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  }
}
