import type { PeopleInterface } from "./PeopleInterface"

interface SystemSettingInterface {
  [key: string]: any
  systemSettingId: number | null,
  systemSettingTradeName: string | null,
  systemSettingLogo: string | null,
  systemSettingSidebarColor: string | null,
  systemSettingActive: number | null,
  systemSettingCreatedAt: Date | string | null,
  systemSettingUpdatedAt: Date | string | null,
  systemSettingDeletedAt: Date | string | null,
}

export type { SystemSettingInterface }