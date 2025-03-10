interface ShiftInterface {
  employees: any
  shiftId: number | null
  shiftName: string
  shiftCalculateFlag?: string | null
  shiftDayStart: number | null
  shiftTimeStart: string
  shiftActiveHours: number
  shiftRestDays: any
  employee_count: any
  shiftCreatedAt: Date | string | null
  shiftUpdatedAt: Date | string | null
  shiftDeletedAt: Date | string | null
}

export type { ShiftInterface }
