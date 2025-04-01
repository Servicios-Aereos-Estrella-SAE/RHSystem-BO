interface ToleranceInterface {
  toleranceId: number | null,
  toleranceName: string,
  toleranceMinutes: number,
  systemSettingId: number,
  toleranceCreatedAt?: string,
  toleranceUpdatedAt?: string,
  toleranceDeletedAt?: string | null
}

export type { ToleranceInterface }
