import type { ShiftExceptionInterface } from "./ShiftExceptionInterface"


interface AssistExcelRowInterface {
  code: string
  name: string
  department: string
  position: string
  date: string
  shiftAssigned: string
  shiftStartDate: string
  shiftEndsDate: string
  checkInTime: string
  firstCheck: string
  lunchTime: string
  returnLunchTime: string
  checkOutTime: string
  hoursWorked: number
  lastCheck: string
  incidents: string
  notes: string
  sundayPremium: string
  checkOutStatus: string
  exceptions: ShiftExceptionInterface[]
}
export type { AssistExcelRowInterface }
