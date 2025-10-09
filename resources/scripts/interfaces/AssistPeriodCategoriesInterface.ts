interface AssistPeriodCategoriesInterface {
  periodSelected: Date
  paymentType: string | null
  fixedEveryNWeeksToBePaid: number | null
  daysToOffset: number | null
  periodsToOffset: number | null
  dateApplySince: string | null
  fixedDayToBePaid: string | null
  dayToBePaid: number | null
  dayEndToBePaid: number | null
  localeToUse: string
  advanceDateInMonthsOf31Days: boolean
  advanceDateOnHolidays: boolean
  advanceDateOnWeekends: boolean
  paymentDates: Date[]
}

export type { AssistPeriodCategoriesInterface }
