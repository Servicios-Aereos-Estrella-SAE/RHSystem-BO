import type { EmployeeInterface } from "./EmployeeInterface"

interface DepartmentShiftEmployeeWarningInterface {
  status: number
  type: string
  title: string
  message: string
  employee: EmployeeInterface
}
export type { DepartmentShiftEmployeeWarningInterface }
