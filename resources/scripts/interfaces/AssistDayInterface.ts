import type { AssistInterface } from "./AssistInterface"
import type { ShiftInterface } from "./ShiftInterface"

interface AssistDayInterface {
  day: string
  assist: {
    checkIn: AssistInterface | null
    checkOut: AssistInterface | null
    checkEatIn: AssistInterface | null
    checkEatOut: AssistInterface | null
    dateShift: ShiftInterface | null
    checkInStatus: string
    checkOutStatus: string
    isFutureDay: boolean
    isSundayBonus: boolean
    isRestDay: boolean
    isVacationDate: boolean
    isHoliday: boolean
    checkInDateTime: Date
    checkOutDateTime: Date
    holiday: HolidayInterface | null
  }
}

export type { AssistDayInterface }
