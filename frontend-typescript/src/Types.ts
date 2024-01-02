import { ApexOptions } from "apexcharts"

export interface ValidationErrorType {
  [key: string]: string
}

export interface LocalStorageUserInfoDataType {
  encryptedData: string,
  iv: string
}

export interface AuthUserType {
  email: string,
  password: string
}

export interface StoreUserActionType {
  type: string,
  payload: any
}

export interface PermissionDataType {
  created_at?: string
  id?: number
  permissions: string[]
  role_id: number
  updated_at?: string
}

export interface PermissionFormdataType {
  permissions: PermissionDataType[]
}

export interface RoleDataType {
  created_at?: string
  created_by?: string
  id?: number
  is_active?: string
  permissions?: PermissionDataType
  role_name: string
  role_permissions?: string[]
  updated_at?: string
}

export interface UserFileDataType extends File {
  created_at?: string,
  fileable_id?: number,
  fileable_type?: string,
  id?: number,
  path?: string,
  type: string,
  updated_at?: string
}

export interface UserDataType {
  address: string,
  country_code: string,
  created_at?: string,
  created_by?: string,
  date_of_birth: string,
  email: string,
  password?: string,
  files: UserFileDataType[],
  // files: UserFileDataType[] | string,
  first_name: string,
  gender: string,
  hobbies: string[],
  image?: UserFileDataType[] | string,
  id?: number,
  is_active?: string,
  last_name: string,
  mobile_number: string,
  number_of_attempts?: number,
  role?: RoleDataType
  role_id: string,
  role_name?: string,
  updated_at?: string
}

export interface CurrentUserDataType {
  user: UserDataType,
  token?: string
}

export interface ChartType {
  type: "area" | "line" | "bar" | "pie" | "donut" | "radialBar" | "scatter" | "bubble" | "heatmap" | "candlestick" | "boxPlot" | "radar" | "polarArea" | "rangeBar" | "rangeArea" | "treemap" | undefined,
  height: number,
  series: ApexAxisChartSeries | ApexNonAxisChartSeries,
  options: ApexOptions
}

export interface stateType {
  user: {
    user: UserDataType
  }
}

export interface EventDataType {
  id?: number,
  event_name: string,
  event_color: string,
  event_date: string,
  recurring: string,
  repeat_end_date?: any,
  created_at?: string,
  updated_at?: string
  message?: string,
}

export interface CalendarEventDataType {
  title: string,
  start: string,
  end: string
}

export interface KanbanColumnDataType {
  id?: number,
  column_name: string,
}

export interface TaskDataType {
  id?: number,
  column_id: string,
  title: string,
  due_date: string,
  status: string,
  created_at?: string,
  updated_at?: string
}

