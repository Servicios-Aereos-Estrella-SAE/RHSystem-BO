interface AssistNoPaymentDatesInterface {
  paymentType: string
  fixedEveryNWeeksToBePaid: number | null
  dateApplySince: string | null
  fixedDayToBePaid: string | null
  dayToBePaid: string | null
  localeToUse: string
}

export type { AssistNoPaymentDatesInterface }
