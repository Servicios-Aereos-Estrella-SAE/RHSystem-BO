interface SystemSettingsEmployeeInterface {
  systemSettingEmployeeId: number | null,
  systemSettingId: number,
  employeeLimit: number | null,
  isActive: number,
  deletedAt: Date | string | null,
  systemSettingEmployeeCreatedAt: Date | string | null,
  systemSettingEmployeeUpdatedAt: Date | string | null,
}

export type { SystemSettingsEmployeeInterface }
