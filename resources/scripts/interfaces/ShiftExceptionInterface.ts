interface ShiftExceptionInterface {
  shiftExceptionId: number | null
  employeeId: number
  exceptionTypeId: number
  shiftExceptionsDescription: string
  shiftExceptionsDate: string
  shiftExceptionsCreatedAt: Date | string | null
  shiftExceptionsUpdatedAt: Date | string | null
  shiftExceptionsDeletedAt: Date | string | null
}

export type { ShiftExceptionInterface }
