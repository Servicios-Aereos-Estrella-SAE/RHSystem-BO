interface EmployeeShiftChangeInterface {
  [key: string]: any
  employeeShiftChangeId?: number | null
  employeeIdFrom: number | null
  shiftIdFrom: number | null
  employeeShiftChangeDateFrom: string
  employeeShiftChangeDateFromIsRestDay: number
  employeeIdTo: number | null
  shiftIdTo: number | null
  employeeShiftChangeDateTo: string | null
  employeeShiftChangeDateToIsRestDay: number
  eemployeeShiftChangeCreatedAt?: Date | string | null
  employeeShiftChangeUpdatedAt?: Date | string | null
  employeeShiftChangeDeletedAt?: Date | string | null
}

export type {
  EmployeeShiftChangeInterface
}