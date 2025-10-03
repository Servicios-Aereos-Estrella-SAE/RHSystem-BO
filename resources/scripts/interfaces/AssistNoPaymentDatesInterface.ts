interface AssistNoPaymentDatesInterface {
  paymentType: string
  fixedEveryNWeeksToBePaid: number | null
  dateApplySince: string | null
  fixedDayToBePaid: string | null
  dayToBePaid: string | null
  dayEndToBePaid: string | null
  localeToUse: string,
  advanceDateInMonthsOf31Days: boolean,
  advanceDateOnHolidays: boolean,
  advanceDateOnWeekends: boolean
}

export type { AssistNoPaymentDatesInterface }
