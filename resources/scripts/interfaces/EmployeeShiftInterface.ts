import type { DateTime } from "luxon"
import type { ShiftInterface } from "./ShiftInterface"

interface EmployeeShiftInterface {
  employeeShiftId: number | null
  employeeId: number | null
  shiftId: number | null
  employeShiftsApplySince: string | Date | null
  isActive?: boolean
  employeShiftsCreatedAt: string | Date | null
  employeShiftsUpdatedAt: string | Date | null
  employeShiftsDeletedAt: string | Date | null
  shift?: ShiftInterface
}

export type { EmployeeShiftInterface }