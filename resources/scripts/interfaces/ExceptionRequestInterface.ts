import type { DateTime } from "luxon"
import type { ExceptionTypeInterface } from "./ExceptionTypeInterface"
import type { EmployeeInterface } from "./EmployeeInterface"

interface ExceptionRequestInterface {
  exceptionRequestId: number | null
  employeeId: number | null
  exceptionTypeId: number | null
  exceptionRequestStatus: 'requested' | 'pending' | 'accepted' | 'refused'
  exceptionRequestDescription: string | null
  exceptionRequestCheckInTime: string | null
  exceptionRequestCheckOutTime: string | null
  exceptionRequestCreatedAt?: Date | string | null | DateTime
  exceptionRequestUpdatedAt?: Date | string | null | DateTime
  deletedAt?: Date | string | null | DateTime
  requestedDate?: any
  exceptionType?: ExceptionTypeInterface
  employee?: EmployeeInterface
  daysToApply: number | null
}

export type { ExceptionRequestInterface }
