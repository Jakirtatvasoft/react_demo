import { StoreUserActionType } from "../../Types"
import { GET_CURRENT_USER, SET_CURRENT_USER } from "../../common/constant"

const initialState = {
  user: {}
}

export const userReducer = (state = initialState, action: StoreUserActionType) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        user: action.payload
      }
    
    default:
      return state
  }
}