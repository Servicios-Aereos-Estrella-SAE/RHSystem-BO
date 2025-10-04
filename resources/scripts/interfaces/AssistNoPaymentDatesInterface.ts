interface AssistNoPaymentDatesInterface {
  paymentType: string | null
  fixedEveryNWeeksToBePaid: number | null
  dateApplySince: string | null
  fixedDayToBePaid: string | null
  dayToBePaid: number | null
  dayEndToBePaid: number | null
  localeToUse: string
  advanceDateInMonthsOf31Days: boolean
  advanceDateOnHolidays: boolean
  advanceDateOnWeekends: boolean
}

export type { AssistNoPaymentDatesInterface }
