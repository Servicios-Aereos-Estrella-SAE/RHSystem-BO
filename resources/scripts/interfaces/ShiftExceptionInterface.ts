import type { DateTime } from "luxon"
import type { ExceptionTypeInterface } from "./ExceptionTypeInterface"
import type { EmployeeInterface } from "./EmployeeInterface"

interface ShiftExceptionInterface {
  requestedDate?: string
  shiftExceptionId: number | null
  employeeId: number | null
  exceptionTypeId: number | null
  shiftExceptionsDescription: string
  shiftExceptionsDate: string | null | DateTime | Date
  shiftExceptionCheckInTime: string | null
  shiftExceptionCheckOutTime: string | null
  shiftExceptionEnjoymentOfSalary: number | null
  shiftExceptionTimeByTime: number | null
  shiftExceptionsCreatedAt?: Date | string | null
  shiftExceptionsUpdatedAt?: Date | string | null
  shiftExceptionsDeletedAt?: Date | string | null
  exceptionType?: ExceptionTypeInterface
  employee?: EmployeeInterface
  daysToApply: number | null
  vacationSettingId: number | null
}

export type { ShiftExceptionInterface }
