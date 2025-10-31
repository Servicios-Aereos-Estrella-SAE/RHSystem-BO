interface SystemSettingPayrollConfigInterface {
  systemSettingPayrollConfigId: number | null,
  systemSettingPayrollConfigPaymentType: string,
  systemSettingPayrollConfigFixedDay: string | null,
  systemSettingPayrollConfigFixedEveryNWeeks: number | null,
  systemSettingPayrollConfigNumberOfDaysToBePaid: number | null,
  systemSettingPayrollConfigNumberOfOverdueDaysToOffset: number | null,
  systemSettingPayrollConfigApplySince: string | Date,
  systemSettingId: number,
  systemSettingPayrollConfigCreatedAt: Date | string | null,
  systemSettingPayrollConfigUpdatedAt: Date | string | null,
  systemSettingPayrollConfigDeletedAt: Date | string | null,
}

export type { SystemSettingPayrollConfigInterface }
