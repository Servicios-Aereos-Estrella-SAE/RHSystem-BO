import { DateTime } from 'luxon'
import type { EmployeeInterface } from './EmployeeInterface'

interface ShiftExceptionGeneralErrorInterface {
  shiftExceptionsDate: string | null | DateTime
  employee: EmployeeInterface
  error: string
}

export type { ShiftExceptionGeneralErrorInterface }
