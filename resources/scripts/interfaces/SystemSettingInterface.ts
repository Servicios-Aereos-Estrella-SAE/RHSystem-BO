import SystemSettingPayrollConfigService from "../services/SystemSettingPayrollConfigService"
import type { PeopleInterface } from "./PeopleInterface"
import type { SystemSettingPayrollConfigInterface } from "./SystemSettingPayrollConfigInterface"

interface SystemSettingInterface {
  [key: string]: any
  systemSettingId: number | null,
  systemSettingTradeName: string | null,
  systemSettingLogo: string | null,
  systemSettingBanner: string | null,
  systemSettingFavicon: string | null,
  systemSettingSidebarColor: string | null,
  systemSettingBusinessUnits: string | null,
  systemSettingActive: number | null,
  systemSettingToleranceCountPerAbsence: number | null,
  systemSettingRestrictFutureVacation: number | null,
  systemSettingCreatedAt: Date | string | null,
  systemSettingUpdatedAt: Date | string | null,
  systemSettingDeletedAt: Date | string | null,
  systemSettingPayrollConfigs?: Array<SystemSettingPayrollConfigInterface>
}

export type { SystemSettingInterface }
