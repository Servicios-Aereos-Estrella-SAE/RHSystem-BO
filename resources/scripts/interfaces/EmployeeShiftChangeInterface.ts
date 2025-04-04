interface EmployeeShiftChangeInterface {
  [key: string]: any
  employeeShiftChangeId?: number | null
  employeeIdFrom: number | null
  shiftIdFrom: number | null
  employeeShiftChangeDateFrom: string | Date
  employeeShiftChangeDateFromIsRestDay: number
  employeeIdTo: number | null
  shiftIdTo: number | null
  employeeShiftChangeDateTo: string | null | Date
  employeeShiftChangeDateToIsRestDay: number
  employeeShiftChangeChangeThisShift: boolean
  employeeShiftChangeNote: string | null
  eemployeeShiftChangeCreatedAt?: Date | string | null
  employeeShiftChangeUpdatedAt?: Date | string | null
  employeeShiftChangeDeletedAt?: Date | string | null
}

export type {
  EmployeeShiftChangeInterface
}