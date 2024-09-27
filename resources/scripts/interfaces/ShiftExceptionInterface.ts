import type { DateTime } from "luxon"
import type { ExceptionTypeInterface } from "./ExceptionTypeInterface"

interface ShiftExceptionInterface {
  shiftExceptionId: number | null
  employeeId: number | null
  exceptionTypeId: number | null
  shiftExceptionsDescription: string
  shiftExceptionsDate: string | null | DateTime | Date
  shiftExceptionsCreatedAt: Date | string | null
  shiftExceptionsUpdatedAt: Date | string | null
  shiftExceptionsDeletedAt: Date | string | null
  exceptionType?: ExceptionTypeInterface
}

export type { ShiftExceptionInterface }
