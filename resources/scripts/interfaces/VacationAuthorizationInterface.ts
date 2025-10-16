import type { DateTime } from "luxon"

interface VacationAuthorizationInterface {
  exceptionRequestId: number
  employeeId: number
  exceptionTypeId: number
  exceptionRequestStatus: 'requested' | 'pending' | 'accepted' | 'refused'
  exceptionRequestDescription: string | null
  exceptionRequestCheckInTime: string | null
  exceptionRequestCheckOutTime: string | null
  userId: number
  exceptionRequestCreatedAt: Date | string | DateTime
  exceptionRequestUpdatedAt: Date | string | DateTime
  deletedAt: Date | string | DateTime | null
  requestedDate: Date | string | DateTime
  exceptionRequestRhRead: number
  exceptionRequestGerencialRead: number
}

interface VacationAuthorizationRequestInterface {
  signature: File
  requests: number[]
  vacationSettingId: number
}

interface VacationAuthorizationResponseInterface {
  status: number
  type: string
  title: string
  message: string
  data: VacationAuthorizationInterface[]
}

export type {
  VacationAuthorizationInterface,
  VacationAuthorizationRequestInterface,
  VacationAuthorizationResponseInterface
}
