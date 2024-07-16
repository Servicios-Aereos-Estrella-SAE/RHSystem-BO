import type { DateTime } from "luxon"

interface ShiftExceptionInterface {
  shiftExceptionId: number | null
  employeeId: number | null
  exceptionTypeId: number | null
  shiftExceptionsDescription: string
  shiftExceptionsDate: string | null | DateTime
  shiftExceptionsCreatedAt: Date | string | null
  shiftExceptionsUpdatedAt: Date | string | null
  shiftExceptionsDeletedAt: Date | string | null
}

export type { ShiftExceptionInterface }
