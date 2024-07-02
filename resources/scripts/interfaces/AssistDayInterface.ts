import type { AssistInterface } from "./AssistInterface"
import type { ShiftInterface } from "./ShiftInterface"

interface AssistDayInterface {
  day: string
  assist: {
    checkIn: AssistInterface | null
    checkOut: AssistInterface | null
    dateShift: ShiftInterface | null
    checkInStatus: string
    checkOutStatus: string
    isFutureDay: boolean
    isSundayBonus: boolean
    isRestDay: boolean
    isVacationDate: boolean
    isHoliday: boolean
  }
}

export type { AssistDayInterface }
