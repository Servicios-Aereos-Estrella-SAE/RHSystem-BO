import type { EmployeeInterface } from "./EmployeeInterface"

interface PositionShiftEmployeeWarningInterface {
  status: number
  type: string
  title: string
  message: string
  employee: EmployeeInterface
}
export type { PositionShiftEmployeeWarningInterface }
